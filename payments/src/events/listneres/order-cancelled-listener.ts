import {
  Listener,
  OrderCancelledEvent,
  OrderStatus,
  Subjects,
} from 'common-ticketing';
import { Message } from 'node-nats-streaming';
import Orders from '../../model/ordersModel';
import { queueGroupName } from '../queue-group-name';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const order = await Orders.findOne({
      _id: data.id,
      __v: data.__v - 1,
    });

    if (!order) {
      throw new Error('Order not found');
    }

    order.set({ status: OrderStatus.Cancelled });
    await order.save();
    msg.ack();
  }
}
