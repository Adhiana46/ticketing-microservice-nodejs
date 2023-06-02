import {
  ExpirationCompleteEvent,
  Listener,
  OrderStatus,
  Subjects,
} from "@adhiana-ticketing/common";
import { Message } from "node-nats-streaming";
import { QUEUE_GROUP_NAME } from "./queue-group-name";
import { Order } from "../../models";
import { OrderCanceledExpirePublisher } from "../publishers/order-cancelled-expire-publisher";
import { natsWrapper } from "../../nats-wrapper";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  queueGroupName: string = QUEUE_GROUP_NAME;
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;

  async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
    const order = await Order.findById(data.orderId).populate("ticket");

    if (!order) {
      throw new Error("Order not found");
    }

    const cancelableStatus = [OrderStatus.Created, OrderStatus.AwaitingPayment];
    if (cancelableStatus.indexOf(order.status) === -1) {
      msg.ack();
      return;
    }

    order.set({
      status: OrderStatus.CancelledExpires,
    });
    await order.save();

    new OrderCanceledExpirePublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    msg.ack();
  }
}
