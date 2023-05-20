import {
  Listener,
  OrderCancelledExpireEvent,
  Subjects,
} from "@adhiana-ticketing/common";
import { QUEUE_GROUP_NAME } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../model";
import { TicketUpdatedPublisher } from "../publisher/ticket-updated-publisher";

export class OrderCancelledExpireListener extends Listener<OrderCancelledExpireEvent> {
  subject: Subjects.OrderCanceledExpire = Subjects.OrderCanceledExpire;
  queueGroupName: string = QUEUE_GROUP_NAME;

  async onMessage(data: OrderCancelledExpireEvent["data"], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    ticket.set({ orderId: undefined });
    await ticket.save();

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version,
    });

    msg.ack();
  }
}
