import { Publisher, Subjects, OrderCreatedEvent } from 'common-ticketing';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
