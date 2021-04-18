import { NextFunction, Request, Response } from 'express';
import { OrderStatus } from 'common-ticketing';
import { stripe } from '../stripe';
import { natsWrapper } from '../NATSWrapper';
import { AppError } from '../utils/appError';
import Orders from '../model/ordersModel';
import Payments from '../model/paymentsModel';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';

//---------------------------------------------------//
//                Create Payment                     //
//---------------------------------------------------//

export const createPayments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token, orderId } = req.body;

    if (!token || !orderId) {
      return next(new AppError('Token or Order Id missing', 400));
    }

    const order = await Orders.findById(orderId);
    if (!order) {
      return next(new AppError('Order Not Found', 404));
    }
    if (order.userId !== req.user!.id) {
      return next(new AppError('You are not authorized', 401));
    }

    if (order.status === OrderStatus.Cancelled) {
      return next(
        new AppError('Cannot Pay for already cancelled order. Aborting!!!', 400)
      );
    }

    const charge = await stripe.charges.create({
      currency: 'INR',
      amount: parseFloat(order.price) * 100,
      source: token,
    });

    const payment = await Payments.create({
      orderId,
      stripeId: charge.id,
    });

    await new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment._id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    res.status(201).json({
      status: 'success',
      data: payment,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//---------------------------------------------------//
//                Get Single Payment                   //
//---------------------------------------------------//

//---------------------------------------------------//
//                Get All Order                      //
//---------------------------------------------------//

export const getAllPayments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user!.id;

  try {
  } catch (err) {
    next(err);
  }
};
