import { NextFunction, Request, Response } from 'express';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-event-publishers';
import Tickets, { ITickets } from '../model/ticketsModel';
import { natsWrapper } from '../NATSWrapper';
import { AppError } from '../utils/appError';

export const createTickets = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, price } = req.body;

  const userId = req.user!.id;
  try {
    const tickets: ITickets = await Tickets.create({ title, price, userId });

    // Ticket is created now publish event about it
    const publisher = await new TicketCreatedPublisher(natsWrapper.client);
    publisher.publish({
      id: tickets.id!,
      titile: tickets.title,
      price: tickets.price,
      userId: tickets.userId,
    });

    res.status(201).json({
      status: 'success',
      data: tickets,
    });
  } catch (err) {
    next(err);
  }
};
export const getTicket = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const ticket: ITickets | null = await Tickets.findOne({ _id: id });
    const ticketData = ticket === null ? [] : [ticket];
    res.status(200).json({
      status: 'success',
      data: ticketData,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllTickets = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tickets = await Tickets.find({});
    res.status(200).json({
      status: 'success',
      data: tickets,
    });
  } catch (err) {
    next(err);
  }
};

export const updateTicket = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, price } = req.body;
  const userId = req.user!.id;
  try {
    // Check if user owns the ticket and then update ticket document
    const ticket: ITickets | null = await Tickets.findOneAndUpdate(
      { _id: req.params.id, userId },
      {
        title,
        price,
        userId,
      },
      {
        new: true,
      }
    );

    if (!ticket) {
      return next(new AppError('Unable to update ticket', 400));
    }

    res.status(200).json({
      status: 'success',
      data: [ticket],
    });
  } catch (err) {
    next(err);
  }
};
