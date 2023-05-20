import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from "@adhiana-ticketing/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
