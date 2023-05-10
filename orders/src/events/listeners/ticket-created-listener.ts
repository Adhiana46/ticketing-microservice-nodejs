import {
  Listener,
  Subjects,
  TicketCreatedEvent,
} from "@adhiana-ticketing/common";
import { Message } from "node-nats-streaming";
import { QUEUE_GROUP_NAME } from "./queue-group-name";
import { Ticket } from "../../models";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName: string = QUEUE_GROUP_NAME;

  async onMessage(parsedData: TicketCreatedEvent["data"], msg: Message) {
    const { id, title, price } = parsedData;

    await Ticket.build({
      id,
      title,
      price,
    }).save();

    msg.ack();
  }
}
