import { Publisher, Subjects, OrderCancelledEvent } from 'common-ticketing';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
