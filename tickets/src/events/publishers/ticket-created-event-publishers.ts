import { Subjects, Publisher, TicketCreatedEvent } from 'common-ticketing';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
