import {
  Listener,
  OrderCancelledUserEvent,
  Subjects,
} from "@adhiana-ticketing/common";
import { Message } from "node-nats-streaming";
import { QUEUE_GROUP_NAME } from "./queue-group-name";
import { Ticket } from "../../model";
import { TicketUpdatedPublisher } from "../publisher/ticket-updated-publisher";

export class OrderCancelledUserListener extends Listener<OrderCancelledUserEvent> {
  subject: Subjects.OrderCanceledUser = Subjects.OrderCanceledUser;
  queueGroupName: string = QUEUE_GROUP_NAME;

  async onMessage(data: OrderCancelledUserEvent["data"], msg: Message) {
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
