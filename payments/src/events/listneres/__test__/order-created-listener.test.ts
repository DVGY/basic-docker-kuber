import { OrderCreatedEvent, OrderStatus } from 'common-ticketing';
import { natsWrapper } from '../../../NATSWrapper';
import { OrderCreatedListener } from '../order-created-listeners';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import Orders from '../../../model/ordersModel';

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);
  const data: OrderCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    __v: 0,
    expiresAt: 'aa',
    userId: 'ada',
    status: OrderStatus.Created,
    ticket: {
      id: 'alskd',
      price: '40',
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('replicates the order info', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const order = await Orders.findById(data.id);

  expect(order!.price).toEqual(data.ticket.price);
});

it('acks message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
