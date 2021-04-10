import {
  ExpirationCompleteEvent,
  Listener,
  OrderStatus,
  Subjects,
} from 'common-ticketing';
import { Message } from 'node-nats-streaming';
import Orders from '../../model/ordersModel';
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';
import { queueGroupName } from './queue-group-name';

export class ExpirationCompleteListner extends Listener<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    const order = await Orders.findById(data.orderId).populate('ticket');

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }

    order.set({
      status: OrderStatus.Cancelled,
    });

    await order.save();

    await new OrderCancelledPublisher(this.client).publish({
      id: order._id as string,
      __v: order.__v,
      ticket: {
        id: order.ticket._id as string,
      },
    });

    msg.ack();
  }
}
