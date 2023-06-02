import {
  OrderCancelledUserEvent,
  OrderStatus,
} from "@adhiana-ticketing/common";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledUserListener } from "../order-cancelled-user-listener";
import mongoose from "mongoose";
import { Order } from "../../../models/order";

const setup = async () => {
  const listener = new OrderCancelledUserListener(natsWrapper.client);

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId: "user-id",
    price: 25,
    status: OrderStatus.Created,
  });
  await order.save();

  const data: OrderCancelledUserEvent["data"] = {
    id: order.id,
    version: 1,
    ticket: {
      id: "id-ticket",
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, order };
};

it("update status of order", async () => {
  const { listener, data, msg, order } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.CancelledUser);
});

it("acks the message", async () => {
  const { listener, data, msg, order } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled;
});
