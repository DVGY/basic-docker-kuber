import request from 'supertest';
import { app } from '../../app';

import Tickets from '../../model/ticketsModel';

it('It gives all the orders created by particular user', async () => {
  // Create 2 tickets
  const ticketOne = await Tickets.create({ title: 'MJ Concert', price: '20' });
  const ticketTwo = await Tickets.create({
    title: 'Sonu Nigam Concert',
    price: '200',
  });

  const userOne = global.getCookieJWT();
  const userTwo = global.getCookieJWT();
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

  const response = await request(app)
    .get(`/api/orders/${orderOne.data.id}`)
    .set('Cookie', userOne)
    .expect(200);

  expect(response.body.data).not.toBeNull();
  expect(response.body.data.id).toEqual(orderOne.data.id);
});
