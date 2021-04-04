import { Listener, TicketCreatedEvent, Subjects } from 'common-ticketing';
import { Message } from 'node-nats-streaming';
import Tickets from '../../model/ticketsModel';
import { queueGroupName } from './queue-group-name';

export class TicketCreatedListner extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    console.log(
      `Queue Group ${this.queueGroupName}, Subject: ${this.subject}, Data:`,
      data
    );

    const { id, title, price } = data;
    const ticket = await Tickets.create({ _id: id, title, price });

    msg.ack();
  }
}
