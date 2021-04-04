import { TicketCreatedEvent } from 'common-ticketing';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import Tickets from '../../../model/ticketsModel';
import { natsWrapper } from '../../../NATSWrapper';
import { TicketCreatedListner } from '../ticket-created-listner';

const setup = async () => {
  const listner = new TicketCreatedListner(natsWrapper.client);
  const data: TicketCreatedEvent['data'] = {
    __v: 0,
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'MJ Paris',
    price: '100',
    userId: mongoose.Types.ObjectId().toHexString(),
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listner, data, msg };
};

it('creates and saves a ticket', async () => {
  const { listner, data, msg } = await setup();

  await listner.onMessage(data, msg);

  const ticket = await Tickets.findById(data.id);

  expect(ticket).toBeDefined();
});

it('acks the message', async () => {
  const { data, listner, msg } = await setup();

  await listner.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
