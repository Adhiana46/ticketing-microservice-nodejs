import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Order, OrderStatus, Ticket } from "../../models";
import { natsWrapper } from "../../nats-wrapper";

it("returns an error if the ticket does not exists", async () => {
  const ticketId = new mongoose.Types.ObjectId();
  const cookie = await getCookie();

  await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({
      ticketId: ticketId,
    })
    .expect(404);
});

it("returns an error if the ticket is already reserved", async () => {
  // Create ticket
  const ticket = await Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "ini ticket",
    price: 123,
  }).save();

  // create order
  const order = await Order.build({
    userId: "12345",
    status: OrderStatus.AwaitingPayment,
    ticket: ticket,
    expiresAt: new Date(),
  }).save();

  const cookie = await getCookie();

  await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({
      ticketId: ticket.id,
    })
    .expect(400);
});

it("reserves a ticket", async () => {
  // Create ticket
  const ticket = await Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "ini ticket",
    price: 123,
  }).save();

  const cookie = await getCookie();

  const res = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  // make sure order is saved to database
  const order = await Order.findById(res.body.id);
  expect(order).not.toBeNull();
});

it("emits order created event", async () => {
  // Create ticket
  const ticket = await Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "ini ticket",
    price: 123,
  }).save();

  const cookie = await getCookie();

  const res = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  // make sure order is saved to database
  const order = await Order.findById(res.body.id);
  expect(order).not.toBeNull();

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
