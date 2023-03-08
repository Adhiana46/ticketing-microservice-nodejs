import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from "@adhiana-ticketing/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
