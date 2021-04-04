import mongoose, { Document, Mongoose, Schema } from 'mongoose';
import { OrderStatus } from 'common-ticketing';
import { ITickets } from './ticketsModel';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

export interface IOrders extends Document {
  ticket: ITickets;
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  __v: number;
}

const ordersSchema: Schema = new mongoose.Schema(
  {
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tickets',
      required: [true, 'Please provide a tickeID'],
      validate: {
        //warning : this only point to current doc on new doc creation
        validator: function (ticket: ITickets) {
          return mongoose.Types.ObjectId.isValid(ticket._id);
        },
        message: 'Ticket ID is not Valid',
      },
    },
    userId: {
      type: String,
      required: [true, 'Please provide price'],
    },
    status: {
      type: String,
      required: [true, 'Please provide userID'],
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

//--------------------------------------------------//
//             PRE MIDDLEWARE                       //
//--------------------------------------------------//
ordersSchema.plugin(updateIfCurrentPlugin);

//---------------------------------------------------//
//                 METHODS                           //
//---------------------------------------------------//

// Check if the password matches entered password in db

const Orders = mongoose.model<IOrders>('Orders', ordersSchema);

export default Orders;
