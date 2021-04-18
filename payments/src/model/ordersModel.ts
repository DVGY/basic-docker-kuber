import mongoose, { Document, Schema } from 'mongoose';
import { OrderStatus } from 'common-ticketing';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

export interface IOrders extends Document {
  _id: string;
  price: string;
  userId: string;
  status: OrderStatus;
  __v: number;
}

const ordersSchema: Schema = new mongoose.Schema(
  {
    price: {
      type: String,
      required: [true, 'Please provide price'],
    },
    userId: {
      type: String,
      required: [true, 'Please provide User ID'],
    },
    status: {
      type: String,
      required: [true, 'Please provide Status'],
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
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
