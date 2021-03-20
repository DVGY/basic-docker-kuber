import request from 'supertest';
import { app } from '../../app';

it('Should return a ticket is it is found', async () => {
  const cookie = global.getCookieJWT();

  const createTicketResponse = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'Thequick', price: '20' })
    .expect(201);
  const { id } = createTicketResponse.body.data;

  const getTicketResponse = await request(app)
    .get(`/api/tickets/${id}`)
    .set('Cookie', cookie)
    .send()
    .expect(200);
  expect(getTicketResponse.body.data.length).toEqual(1);
});

it('Should return 404 or empty array if ticket is not found', async () => {
  const cookie = global.getCookieJWT();
  const response = await request(app)
    .get('/api/tickets/604ca2e80f4509002ff83fc2')
    .set('Cookie', cookie)
    .send();
  expect(response.body.data.length).toEqual(0);
});
