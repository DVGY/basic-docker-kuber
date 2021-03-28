import mongoose, { Document, Schema } from 'mongoose';
import { OrderStatus } from 'common-ticketing';

import Orders from '../model/ordersModel';

import validator from 'validator';

export interface ITickets extends Document {
  title: string;
  price: string;
  isTicketReserved(): Promise<boolean>;
}

const ticketsSchema: Schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
    },
    price: {
      type: String,
      required: [true, 'Please provide price'],
      min: 0,
    },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

//--------------------------------------------------//
//             PRE MIDDLEWARE                       //
//--------------------------------------------------//

//---------------------------------------------------//
//                 METHODS                           //
//---------------------------------------------------//
ticketsSchema.methods.isTicketReserved = async function (): Promise<boolean> {
  const existingOrder = await Orders.findOne({
    ticket: this as ITickets,
    status: {
      $in: [
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
        OrderStatus.Created,
      ],
    },
  });

  return !!existingOrder;
};
// Check if the password matches entered password in db

const Tickets = mongoose.model<ITickets>('Tickets', ticketsSchema);

export default Tickets;
