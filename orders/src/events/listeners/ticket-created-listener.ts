import {
  Listener,
  Subjects,
  TicketCreatedEvent,
} from "@adhiana-ticketing/common";
import { Message } from "node-nats-streaming";
import { QUEUE_GROUP_NAME } from "./queue-group-name";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName: string = QUEUE_GROUP_NAME;

  onMessage(parsedData: TicketCreatedEvent["data"], msg: Message): void {
    throw new Error("Method not implemented.");
  }
}
