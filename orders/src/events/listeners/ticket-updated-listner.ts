import { Listener, TicketUpdatedEvent, Subjects } from 'common-ticketing';
import { Message } from 'node-nats-streaming';
import Tickets from '../../model/ticketsModel';
import { queueGroupName } from './queue-group-name';

export class TicketUpdatedListner extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;
  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    console.log(
      `Queue Group ${this.queueGroupName} Subject: ${this.subject} Data:`,
      data
    );
    const ticket = await Tickets.findByIdAndVersionNumber(data);

    if (!ticket) {
      throw new Error('Ticket Not Found');
    }

    const { title, price } = data;
    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}
