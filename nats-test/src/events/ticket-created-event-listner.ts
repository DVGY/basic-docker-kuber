import { Message } from 'node-nats-streaming';

import { Listener } from '../../../common/events/base-listner';
import { Subjects } from '../../../common/events/subjects';
import { TicketCreatedEvent } from '../../../common/events/tickect-created-event';

export class TicketCreatedListner extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  // we can also write above statement as  readonly subject = Subjects.TicketCreated;
  queueGroupName = 'payments-service';
  onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    console.log('Event data', data);
    msg.ack();
  }
}
