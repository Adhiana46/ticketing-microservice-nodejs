import { Message } from "node-nats-streaming";
import { Listener } from "./base-listener";
import { TicketCreatedEvent } from "./ticket-created-event";
import { Subjects } from "./subjects";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName: string = "payment-service";

  onMessage(data: TicketCreatedEvent["data"], msg: Message): void {
    console.log("Event data!", data);

    console.log(data.price);

    msg.ack();
  }
}
