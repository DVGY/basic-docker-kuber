import request from 'supertest';
import { app } from '../../app';

it('Should return a  ALL TICKETS', async () => {
  const cookie = global.getCookieJWT();

  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'Thequick', price: '20' })
    .expect(201);
  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'Thequick1', price: '210' })
    .expect(201);
  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'Thequick2', price: '320' })
    .expect(201);

  const response = await request(app)
    .get(`/api/tickets`)
    .set('Cookie', cookie)
    .send()
    .expect(200);
  expect(response.body.data.length).toEqual(3);
});
