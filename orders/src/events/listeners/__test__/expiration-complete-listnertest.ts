import Tickets from '../../../model/ticketsModel';
import { natsWrapper } from '../../../NATSWrapper';
import { ExpirationCompleteListner } from '../expiration-complete-listner';
import mongoose from 'mongoose';
import Orders from '../../../model/ordersModel';
import { ExpirationCompleteEvent, OrderStatus } from 'common-ticketing';
import { Message } from 'node-nats-streaming';

const setup = async () => {
  const listner = new ExpirationCompleteListner(natsWrapper.client);

  const ticket = await Tickets.create({
    _id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: '30',
  });

  const order = await Orders.create({
    status: OrderStatus.Created,
    userId: 'sadf',
    expiresAt: new Date(),
    ticket,
  });

  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id as string,
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listner, order, msg, data };
};

it('updates the order status to cancelled', async () => {
  const { listner, order, msg, data } = await setup();

  await listner.onMessage(data, msg);

  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(eventData.id).toEqual(order.id);
});

it('emit and OrderCancelled event', async () => {
  const { listner, order, msg, data } = await setup();

  await listner.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('ack the message', async () => {});
