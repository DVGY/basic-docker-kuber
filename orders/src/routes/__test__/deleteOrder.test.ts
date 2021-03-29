import request from 'supertest';
import { app } from '../../app';
import Orders from '../../model/ordersModel';

import Tickets from '../../model/ticketsModel';
import { natsWrapper } from '../../NATSWrapper';

it('It should soft delete a order', async () => {
  // Create 2 tickets
  const ticketOne = await Tickets.create({ title: 'MJ Concert', price: '20' });
  const ticketTwo = await Tickets.create({
    title: 'Sonu Nigam Concert',
    price: '200',
  });

  const userOne = global.getCookieJWT();
  const userTwo = global.getCookieJWT();

  // Create two orders
  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticketOne._id })
    .expect(201);

  await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticketTwo._id })
    .expect(201);

  // delete a order
  const response = await request(app)
    .delete(`/api/orders/${orderOne.data.id}`)
    .set('Cookie', userOne)
    .expect(204);

  const updatedOrderOne = await Orders.findById(orderOne.data.id);

  expect(updatedOrderOne!.status).toEqual('cancelled');
});

it('It should throw not authorized error if unauthorized user tries to acces the order', async () => {
  // Create 2 tickets
  const ticketOne = await Tickets.create({ title: 'MJ Concert', price: '20' });
  const ticketTwo = await Tickets.create({
    title: 'Sonu Nigam Concert',
    price: '200',
  });

  const userOne = global.getCookieJWT();
  const userTwo = global.getCookieJWT();

  // Create two orders
  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticketOne._id })
    .expect(201);

  await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticketTwo._id })
    .expect(201);

  // delete a order
  const response = await request(app)
    .delete(`/api/orders/${orderOne.data.id}`)
    .set('Cookie', userTwo)
    .expect(401);
});

it('Publishes an order deleted event', async () => {
  // Create 2 tickets
  const ticketOne = await Tickets.create({ title: 'MJ Concert', price: '20' });
  const ticketTwo = await Tickets.create({
    title: 'Sonu Nigam Concert',
    price: '200',
  });

  const userOne = global.getCookieJWT();
  const userTwo = global.getCookieJWT();

  // Create two orders
  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticketOne._id })
    .expect(201);

  await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticketTwo._id })
    .expect(201);

  // delete a order
  const response = await request(app)
    .delete(`/api/orders/${orderOne.data.id}`)
    .set('Cookie', userOne)
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
