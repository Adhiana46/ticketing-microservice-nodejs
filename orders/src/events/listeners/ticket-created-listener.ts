import {
  Listener,
  Subjects,
  TicketCreatedEvent,
} from "@adhiana-ticketing/common";
import { Message } from "node-nats-streaming";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName: string = "order-service";

  onMessage(parsedData: TicketCreatedEvent["data"], msg: Message): void {
    throw new Error("Method not implemented.");
  }
}
