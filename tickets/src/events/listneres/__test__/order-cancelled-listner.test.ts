import { OrderCancelledEvent, OrderStatus } from 'common-ticketing';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import Tickets from '../../../model/ticketsModel';
import { natsWrapper } from '../../../NATSWrapper';
import { OrderCancelledListner } from '../order-cancelled-listner';

const setup = async () => {
  const listner = new OrderCancelledListner(natsWrapper.client);

  const orderId = mongoose.Types.ObjectId().toHexString();
  const ticket = await Tickets.create({
    title: 'MJ Concert',
    price: '900',
    userId: '12dsf',
    orderId,
  });

  const data: OrderCancelledEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    __v: 0,

    ticket: {
      id: ticket.id as string,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listner, ticket, data, msg };
};

it('updates orderId of the ticket to unreserved', async () => {
  const { listner, ticket, data, msg } = await setup();
  await listner.onMessage(data, msg);

  const updatedTicket = await Tickets.findById(ticket.id);

  expect(updatedTicket!.orderId).not.toBeDefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
