import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models";
import mongoose from "mongoose";

const buildTicket = async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Konser BlackPink",
    price: 30,
  });
  await ticket.save();

  return ticket;
};

it("fetches orders for a particular user", async () => {
  // Create three ticket
  const ticket1 = await buildTicket();
  const ticket2 = await buildTicket();
  const ticket3 = await buildTicket();

  const user1 = await getCookie();
  const user2 = await getCookie();

  // Create one order as User #1
  await request(app)
    .post("/api/orders")
    .set("Cookie", user1)
    .send({
      ticketId: ticket1.id,
    })
    .expect(201);

  // Create two order as User #2
  const { body: order1 } = await request(app)
    .post("/api/orders")
    .set("Cookie", user2)
    .send({
      ticketId: ticket2.id,
    })
    .expect(201);
  const { body: order2 } = await request(app)
    .post("/api/orders")
    .set("Cookie", user2)
    .send({
      ticketId: ticket3.id,
    })
    .expect(201);

  // Make request to get orders for User #2
  const res = await request(app)
    .get("/api/orders")
    .set("Cookie", user2)
    .send()
    .expect(200);

  // Make sure we only got the orders for User #2
  expect(res.body.length).toEqual(2);
  expect(res.body[0].id).toEqual(order1.id);
  expect(res.body[1].id).toEqual(order2.id);
  expect(res.body[0].ticket.id).toEqual(ticket2.id);
  expect(res.body[1].ticket.id).toEqual(ticket3.id);
});
