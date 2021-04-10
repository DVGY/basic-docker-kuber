import { Publisher, ExpirationCompleteEvent, Subjects } from 'common-ticketing';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
