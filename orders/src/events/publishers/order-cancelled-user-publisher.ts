import {
  Publisher,
  OrderCancelledUserEvent,
  Subjects,
} from "@adhiana-ticketing/common";

export class OrderCancelledUserPublisher extends Publisher<OrderCancelledUserEvent> {
  subject: Subjects.OrderCanceledUser = Subjects.OrderCanceledUser;
}
