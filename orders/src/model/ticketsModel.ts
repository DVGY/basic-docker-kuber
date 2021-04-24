import mongoose, { Document, Schema, Model } from 'mongoose';
import { OrderStatus } from 'common-ticketing';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

import Orders from '../model/ordersModel';

export interface ITickets extends Document {
  _id: string;
  title: string;
  price: string;
  __v: number;

  isTicketReserved(): Promise<boolean>;
}
export interface ITicketsModel extends Model<ITickets> {
  findByIdAndVersionNumber(event: {
    id: string;
    __v: number;
  }): Promise<ITickets | null>;
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
      },
    },
  }
);

//--------------------------------------------------//
//             PRE MIDDLEWARE                       //
//--------------------------------------------------//
ticketsSchema.plugin(updateIfCurrentPlugin);

/* This behaves same as the above updateIfCurrentPlugin*/
// ticketsSchema.pre('save',function(done){
//   this.$where = {
//     __v:this.get('__v') - 1
//   }
//   done();
// })

//---------------------------------------------------//
//                 STATICS                           //
//---------------------------------------------------//
ticketsSchema.statics.findByIdAndVersionNumber = async function (event: {
  id: string;
  __v: number;
}): Promise<ITickets | null> {
  return Tickets.findOne({ _id: event.id, __v: event.__v - 1 });
};

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
  console.log(existingOrder);
  return !!existingOrder;
};
// Check if the password matches entered password in db

const Tickets = mongoose.model<ITickets, ITicketsModel>(
  'Tickets',
  ticketsSchema
);

export default Tickets;
