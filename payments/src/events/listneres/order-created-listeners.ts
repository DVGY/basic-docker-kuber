import {
  Listener,
  OrderCancelledEvent,
  OrderCreatedEvent,
  Subjects,
} from 'common-ticketing';
import { Message } from 'node-nats-streaming';
import Orders, { IOrders } from '../../model/ordersModel';
import { queueGroupName } from '../queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const order = await Orders.create({
      _id: data.id,
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
      __v: data.__v,
    });

    msg.ack();
  }
}
