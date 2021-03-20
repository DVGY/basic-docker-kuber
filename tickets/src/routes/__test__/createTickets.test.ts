import request from 'supertest';
import { app } from '../../app';
import Tickets from '../../model/ticketsModel';

it('has a route handler /api/tickets for post request', async () => {
  const response = await request(app).post('/api/tickets').send({});
  expect(response.status).not.toEqual(404);
});
it('CANNOT be accessed if user is NOT signed in', async () => {
  const response = await request(app).post('/api/tickets').send({});
  expect(response.status).toEqual(401);
});

it('can only be accessed if user is signed in', async () => {
  const cookie = global.getCookieJWT();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'Thequick', price: 'Loll' });

  expect(response.status).toEqual(201);
});

it('throws validation error on wrong title and price values /api/tickets for post request', async () => {
  const cookie = global.getCookieJWT();

  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: '',
      price: '',
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      price: '12',
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({})
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: '',
    })
    .expect(400);
});
it('creates a new record inside Mongo DB /api/tickets for post request', async () => {
  let tickets = await Tickets.find({});
  expect(tickets.length).toEqual(0);

  const cookie = global.getCookieJWT();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'Thequick', price: '20' });

  expect(response.status).toEqual(201);
  tickets = await Tickets.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].title).toEqual('Thequick');
  expect(tickets[0].price).toEqual('20');
});
