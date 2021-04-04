import { OrderCreatedEvent, OrderStatus } from 'common-ticketing';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import Tickets from '../../../model/ticketsModel';
import { natsWrapper } from '../../../NATSWrapper';
import { OrderCreatedListner } from '../order-created-listner';

const setup = async () => {
  const listner = new OrderCreatedListner(natsWrapper.client);

  const ticket = await Tickets.create({
    title: 'MJ Concert',
    price: '900',
    userId: '12dsf',
  });

  const data: OrderCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    userId: 'asdfasdf',
    expiresAt: 'daffas',
    __v: 0,

    ticket: {
      id: ticket.id as string,
      price: ticket.price,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listner, ticket, data, msg };
};

it('sets the orderId of the ticket', async () => {
  const { listner, ticket, data, msg } = await setup();
  await listner.onMessage(data, msg);

  const updatedTicket = await Tickets.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id);
});

it('acks the message', async () => {
  const { listner, ticket, data, msg } = await setup();
  await listner.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event', async () => {
  const { listner, ticket, data, msg } = await setup();
  await listner.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const ticketUpdatedData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(data.id).toEqual(ticketUpdatedData.orderId);
});
