import {
  Publisher,
  OrderCancelledExpireEvent,
  Subjects,
} from "@adhiana-ticketing/common";

export class OrderCanceledExpirePublisher extends Publisher<OrderCancelledExpireEvent> {
  subject: Subjects.OrderCanceledExpire = Subjects.OrderCanceledExpire;
}
