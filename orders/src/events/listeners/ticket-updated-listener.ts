import {
  Listener,
  Subjects,
  TicketUpdatedEvent,
} from "@adhiana-ticketing/common";
import { Message } from "node-nats-streaming";
import { QUEUE_GROUP_NAME } from "./queue-group-name";
import { Ticket } from "../../models";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName: string = QUEUE_GROUP_NAME;

  async onMessage(parsedData: TicketUpdatedEvent["data"], msg: Message) {
    const ticket = await Ticket.findByEvent(parsedData);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    const { title, price } = parsedData;
    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}
