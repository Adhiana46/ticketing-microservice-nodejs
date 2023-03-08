import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from "@adhiana-ticketing/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
