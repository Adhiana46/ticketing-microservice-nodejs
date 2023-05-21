import {
  Listener,
  OrderCancelledUserEvent,
  OrderStatus,
  Subjects,
} from "@adhiana-ticketing/common";
import { QUEUE_GROUP_NAME } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class OrderCancelledUserListener extends Listener<OrderCancelledUserEvent> {
  subject: Subjects.OrderCanceledUser = Subjects.OrderCanceledUser;
  queueGroupName: string = QUEUE_GROUP_NAME;

  async onMessage(data: OrderCancelledUserEvent["data"], msg: Message) {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });

    if (!order) {
      throw new Error("order not found");
    }

    order.set({
      status: OrderStatus.CancelledUser,
    });
    await order.save();

    msg.ack();
  }
}
