import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Order } from "../../models/order";
import { OrderStatus } from "@adhiana-ticketing/common";

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
