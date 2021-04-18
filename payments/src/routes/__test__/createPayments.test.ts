import request from 'supertest';
import mongoose from 'mongoose';
import { OrderStatus } from 'common-ticketing';

import { app } from '../../app';
import Orders from '../../model/ordersModel';
import { stripe } from '../../stripe';
import Payments from '../../model/paymentsModel';

// jest.mock('../../stripe');

it('return 404 error when purchasing an order that does not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.getCookieJWT())
    .send({
      token: 'addf',
      orderId: mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it('return 401 when purchasing an order does not belong to user', async () => {
  const order = await Orders.create({
    _id: mongoose.Types.ObjectId().toHexString(),
    userId: mongoose.Types.ObjectId().toHexString(),
    __v: 0,
    price: '30',
    status: OrderStatus.Created,
  });

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.getCookieJWT())
    .send({
      token: 'addf',
      orderId: order._id,
    })
    .expect(401);
});

it('return 400 when purchasing a cancelled order', async () => {
  const order = await Orders.create({
    _id: mongoose.Types.ObjectId().toHexString(),
    userId: mongoose.Types.ObjectId().toHexString(),
    __v: 0,
    price: '30',
    status: OrderStatus.Cancelled,
  });

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.getCookieJWT(order.userId))
    .send({
      token: 'addf',
      orderId: order._id,
    })
    .expect(400);
});

// it('Successfully process a payment for order', async () => {
//   const order = await Orders.create({
//     _id: mongoose.Types.ObjectId().toHexString(),
//     userId: mongoose.Types.ObjectId().toHexString(),
//     __v: 0,
//     price: '30',
//     status: OrderStatus.Created,
//   });

//   await request(app)
//     .post('/api/payments')
//     .set('Cookie', global.getCookieJWT(order.userId))
//     .send({
//       token: 'tok_visa',
//       orderId: order._id,
//     })
//     .expect(201);

//   const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
//   expect(chargeOptions.source).toEqual('tok_visa');
//   expect(chargeOptions.amount).toEqual(parseFloat(order.price) * 100);
//   expect(chargeOptions.currency).toEqual('INR');
// });

it('A more realistic test -> Successfully process a payment for order', async () => {
  const order = await Orders.create({
    _id: mongoose.Types.ObjectId().toHexString(),
    userId: mongoose.Types.ObjectId().toHexString(),
    __v: 0,
    price: '30',
    status: OrderStatus.Created,
  });

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.getCookieJWT(order.userId))
    .send({
      token: 'tok_visa',
      orderId: order._id,
    })
    .expect(201);

  const stripeCharges = await stripe.charges.list({ limit: 10 });
  const stripeCharge = stripeCharges.data.find(
    (charge) => charge.amount === parseFloat(order.price) * 100
  );

  expect(stripeCharge).toBeDefined();

  const payment = await Payments.create({
    orderId: order._id,
    stripeId: stripeCharge!.id,
  });
  expect(payment).toBeDefined();
});
