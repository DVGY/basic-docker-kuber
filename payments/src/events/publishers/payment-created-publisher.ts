import { PaymentCreatedEvent, Publisher, Subjects } from 'common-ticketing';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
