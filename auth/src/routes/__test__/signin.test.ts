import request from 'supertest';
import { app } from '../../app';

it('should send 201 for successfull signin and set-cookie in headers, route /api/users/signin', async function () {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(200);

  expect(response.get('Set-Cookie')).toBeDefined();
});

it('should send 401 for invalid signin credentials, route /api/users/signin', async function () {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'passwor',
    })
    .expect(401);

  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test2.com',
      password: 'password',
    })
    .expect(401);

  return request(app).post('/api/users/signin').send({}).expect(400);
});
