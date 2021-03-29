import { NextFunction, Request, Response } from 'express';
import { OrderStatus } from 'common-ticketing';

import Tickets from '../model/ticketsModel';
import Orders from '../model/ordersModel';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
// import Tickets, { ITickets } from '../model/ticketsModel';
import { natsWrapper } from '../NATSWrapper';
import { AppError } from '../utils/appError';

const EXPIRATION_TIME_SECONDS = 15 * 60;

//---------------------------------------------------//
//                Create Order                       //
//---------------------------------------------------//

export const createOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { ticketId } = req.body;

  const userId = req.user!.id;
  try {
    // Make sure ticket exist in database
    const ticket = await Tickets.findById(ticketId);
    if (!ticket) {
      throw new AppError('Ticket not found', 404);
    }

    // Check ticket is not reserved
    const existingOrder = await ticket.isTicketReserved();
    if (existingOrder) {
      throw new AppError('Ticket is already reserved', 400);
    }

    // Calc an expiration date of order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_TIME_SECONDS);

    // Create the order and save it to databse
    const order = await Orders.create({
      userId,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });

    // Publish an event that order is created

    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id!,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id!,
        price: ticket.price,
      },
    });

    res.status(201).json({
      status: 'success',
      data: order,
    });
  } catch (err) {
    next(err);
  }
};

//---------------------------------------------------//
//                Get Single Order                   //
//---------------------------------------------------//

export const getOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const orderId = req.params.id;
  const userId = req.user!.id;
  try {
    const order = await Orders.findById(orderId).populate('ticket');

    if (order!.userId !== userId) {
      throw new AppError('You are not authorized', 401);
    }

    res.status(200).json({
      status: 'success',
      data: order,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//---------------------------------------------------//
//                Get All Order                      //
//---------------------------------------------------//

export const getAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user!.id;

  try {
    const orders = await Orders.find({ userId }).populate('ticket');
    res.status(200).json({
      status: 'success',
      data: orders,
    });
  } catch (err) {
    next(err);
  }
};

//---------------------------------------------------//
//                Delete Order                       //
//---------------------------------------------------//

export const deleteOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const orderId = req.params.id;
  const userId = req.user!.id;
  try {
    const order = await Orders.findById(orderId).populate('ticket');

    if (!order) {
      throw new AppError('Order Not Found', 404);
    }

    if (order && order!.userId !== userId) {
      throw new AppError('You are not authorized', 401);
    }

    order.status = OrderStatus.Cancelled;

    await order.save();

    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id!,
      ticket: {
        id: order.ticket.id!,
      },
    });

    res.status(204).json({
      status: 'success',
    });
  } catch (err) {
    next(err);
  }
};
