import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import Tickets from '../../model/ticketsModel';
import { natsWrapper } from '../../NATSWrapper';

it('Should update a ticket with new title and price', async () => {
  const cookie = global.getCookieJWT();
  const createTicketResponse = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'Thequick', price: '20' })
    .expect(201);

  const { id } = createTicketResponse.body.data;
  const updateTicketResponse = await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', cookie)
    .send({ title: 'New updated Title', price: '100' })
    .expect(200);

  expect(updateTicketResponse.body.data[0].title).toEqual('New updated Title');
  expect(updateTicketResponse.body.data[0].price).toEqual('100');
});

it('Should NOT update a  another users ticket with new title and price', async () => {
  const createTicketResponse = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.getCookieJWT())
    .send({ title: 'Thequick', price: '20' })
    .expect(201);

  const { id } = createTicketResponse.body.data;

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.getCookieJWT())
    .send({ title: 'New updated Title', price: '100' })
    .expect(400);
});

it('Should Publish an event', async () => {
  const cookie = global.getCookieJWT();
  const createTicketResponse = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'Thequick', price: '20' })
    .expect(201);

  const { id } = createTicketResponse.body.data;
  const updateTicketResponse = await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', cookie)
    .send({ title: 'New updated Title', price: '100' })
    .expect(200);

  expect(updateTicketResponse.body.data[0].title).toEqual('New updated Title');
  expect(updateTicketResponse.body.data[0].price).toEqual('100');

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('Rejects updates if ticket is reserved', async () => {
  const cookie = global.getCookieJWT();
  const createTicketResponse = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'Thequick', price: '20' })
    .expect(201);
  const { id } = createTicketResponse.body.data;

  // Find and update a ticket with some order id and try to access it

  const ticket = await Tickets.findById(createTicketResponse.body.data.id);
  ticket!.set({ orderId: mongoose.Types.ObjectId().toHexString() });
  await ticket!.save();

  const updateTicketResponse = await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', cookie)
    .send({ title: 'New updated Title', price: '100' })
    .expect(400);
});
