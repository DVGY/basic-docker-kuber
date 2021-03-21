import { Subjects, Publisher, TicketUpdatedEvent } from 'common-ticketing';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
