import { Message } from 'node-nats-streaming';
import { Listener, OrderCancelledEvent, Subjects } from 'common-ticketing';

import { queueGroupName } from './queueGroupName';
import Tickets from '../../model/ticketsModel';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-event-publisher';

export class OrderCancelledListner extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    // Order is cancelled, now find the associated ticked and removed related orderId
    const ticket = await Tickets.findById(data.ticket.id);

    if (!ticket) {
      throw new Error('Ticket not found');
    }
    ticket.set({ orderId: undefined });
    await ticket.save();

    // Publish event that the ticket is updated with related orderId (unreserve)
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket._id as string,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      __v: ticket.__v as number,

      orderId: ticket.orderId,
    });
    msg.ack();
  }
}
