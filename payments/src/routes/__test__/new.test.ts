import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Order } from "../../models/order";
import { OrderStatus } from "@adhiana-ticketing/common";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payment";
import { natsWrapper } from "../../nats-wrapper";

it("return an error 404 if order not found", async () => {
  const token = "some-random-secure-token";
  const orderId = new mongoose.Types.ObjectId();
  const cookie = await getCookie();

  await request(app)
    .post("/api/payments")
    .set("Cookie", cookie)
    .send({
      token,
      orderId,
    })
    .expect(404);
});

it("return not authorized error if user does not own the order", async () => {
  // Create Order
  const order = await Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId: "some-user-id",
    price: 1225,
    status: OrderStatus.AwaitingPayment,
  }).save();

  const token = "some-random-secure-token";
  const cookie = await getCookie();

  await request(app)
    .post("/api/payments")
    .set("Cookie", cookie)
    .send({
      token,
      orderId: order.id,
    })
    .expect(401);
});

it("return an error if order is cancelled", async () => {
  // Create Order
  const order = await Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId: "user-id",
    price: 1225,
    status: OrderStatus.CancelledExpires,
  }).save();

  const token = "some-random-secure-token";
  const cookie = await getCookie("user-id");

  await request(app)
    .post("/api/payments")
    .set("Cookie", cookie)
    .send({
      token,
      orderId: order.id,
    })
    .expect(400);
});

it("return a 201 with valid inputs", async () => {
  const price = Math.floor(Math.random() * 1000000);

  // Create Order
  const order = await Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId: "user-id",
    price: price,
    status: OrderStatus.Created,
  }).save();

  const token = "tok_visa";
  const cookie = await getCookie("user-id");

  await request(app)
    .post("/api/payments")
    .set("Cookie", cookie)
    .send({
      token,
      orderId: order.id,
    })
    .expect(201);

  const stripeCharges = await stripe.charges.list({ limit: 10 });
  const stripeCharge = stripeCharges.data.find((charge) => {
    return charge.amount === price * 100;
  });

  expect(stripeCharge).toBeDefined();
  expect(stripeCharge!.currency).toEqual("usd");

  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: stripeCharge!.id,
  });
  expect(payment).not.toBeNull();

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
