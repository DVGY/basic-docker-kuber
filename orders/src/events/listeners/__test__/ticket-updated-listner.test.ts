import mongoose from 'mongoose';
import { TicketUpdatedEvent } from 'common-ticketing';
import Tickets from '../../../model/ticketsModel';
import { natsWrapper } from '../../../NATSWrapper';
import { TicketUpdatedListner } from '../ticket-updated-listner';
import { Message } from 'node-nats-streaming';

const setup = async () => {
  const listner = new TicketUpdatedListner(natsWrapper.client);

  // This means we have some existing ticket in db, thta was recevied on ticket created listner
  const ticket = await Tickets.create({
    _id: mongoose.Types.ObjectId().toHexString(),
    title: 'MJ Concert Budapast',
    price: '300',
  });

  // When we recieved a updated event it's version number should previous version number plus one
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id as string,
    title: 'MJ Mumbai Concert',
    price: '100',
    userId: '12asdf',
    __v: ticket.__v + 1,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { msg, data, ticket, listner };
};

it('Find, updates and saves ticket', async () => {
  const { msg, data, ticket, listner } = await setup();

  await listner.onMessage(data, msg);
  const updatedTicket = await Tickets.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.__v).toEqual(data.__v);
});

it('acks the message', async () => {
  const { msg, data, listner } = await setup();

  await listner.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event version number is difference is greater than one', async () => {
  const { msg, data, listner } = await setup();

  data.__v = 100;

  try {
    await listner.onMessage(data, msg);
  } catch (error) {}

  expect(msg.ack).not.toHaveBeenCalled();
});
