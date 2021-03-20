import { Message } from 'node-nats-streaming';

import { Publisher } from '../../../common/events/base-publisher';
import { Subjects } from '../../../common/events/subjects';
import { TicketCreatedEvent } from '../../../common/events/tickect-created-event';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  // we can also write above statement as  readonly subject = Subjects.TicketCreated;
}
