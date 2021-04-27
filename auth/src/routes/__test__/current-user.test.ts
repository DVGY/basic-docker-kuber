import request from 'supertest';
import { app } from '../../app';

it('should send 200 and currentUser property should have valid values, route /api/users/signin', async function () {
  const cookie = await global.getCookieJWT();

  const currentUserResp = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .expect(200);

  expect(currentUserResp.body.data.currentUser).toBeDefined();
  //   expect(currentUserRes.body).toBeDefined();
});

it('should send 400 when accessed without cookie, route /api/users/signin', async function () {
  return request(app).get('/api/users/currentuser').expect(401);
});
