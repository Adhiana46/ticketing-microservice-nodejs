import {
  Publisher,
  OrderCreatedEvent,
  Subjects,
} from "@adhiana-ticketing/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
