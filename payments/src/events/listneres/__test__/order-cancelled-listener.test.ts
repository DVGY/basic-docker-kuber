import { OrderCancelledEvent, OrderStatus } from 'common-ticketing';
import { natsWrapper } from '../../../NATSWrapper';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import Orders from '../../../model/ordersModel';
import { OrderCancelledListener } from '../order-cancelled-listener';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = await Orders.create({
    _id: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: '20',
    userId: 'sadf',
    __v: 0,
  });

  const data: OrderCancelledEvent['data'] = {
    id: order._id,
    __v: 1,
    ticket: {
      id: 'alskd',
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, order };
};

it('updates the status of the order', async () => {
  const { listener, data, msg, order } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Orders.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('acks message', async () => {
  const { listener, data, msg, order } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
