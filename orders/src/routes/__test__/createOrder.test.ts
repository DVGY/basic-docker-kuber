import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import Orders from '../../model/ordersModel';
import Tickets from '../../model/ticketsModel';
import { OrderStatus } from 'common-ticketing';
import { natsWrapper } from '../../NATSWrapper';

it('return an error if ticket does not exist', async () => {
  const ticketId = mongoose.Types.ObjectId;

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.getCookieJWT())
    .send({ ticketId })
    .expect(404);
});

it('return an error if ticket is reserved', async () => {
  const ticket = await Tickets.create({
    title: 'Test',
    price: '22xyz',
  });
  const EXPIRATION_TIME_SECONDS = 15 * 60;

  const expiration = new Date();
  expiration.setSeconds(expiration.getSeconds() + EXPIRATION_TIME_SECONDS);
  const order = await Orders.create({
    ticket,
    status: OrderStatus.Created,
    expiresAt: expiration,
    userId: 'asfasfasdf',
  });

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.getCookieJWT())
    .send({ ticketId: ticket._id })
    .expect(400);
});

it('reserves a ticket', async () => {
  const ticket = await Tickets.create({
    title: 'Test',
    price: '22xyz',
  });

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.getCookieJWT())
    .send({ ticketId: ticket._id })
    .expect(201);
});

it('Publish a order created event', async () => {
  const ticket = await Tickets.create({
    title: 'Test',
    price: '22xyz',
  });

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.getCookieJWT())
    .send({ ticketId: ticket._id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
