import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, Subjects } from 'common-ticketing';

import { queueGroupName } from './queueGroupName';
import Tickets from '../../model/ticketsModel';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-event-publisher';

export class OrderCreatedListner extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // Order is created, now find the associated ticked and put related orderId
    const ticket = await Tickets.findById(data.ticket.id);

    if (!ticket) {
      throw new Error('Ticket not found');
    }
    ticket.set({ orderId: data.id });
    await ticket.save();

    // Publish event that the ticket is updated with related orderId
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket._id as string,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      __v: ticket.__v as number,

      orderId: ticket.orderId,
    });
    // Ack
    msg.ack();
  }
}
