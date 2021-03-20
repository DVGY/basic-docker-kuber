import mongoose, { Document, Schema } from 'mongoose';
import validator from 'validator';

export interface ITickets extends Document {
  title: string;
  price: string;
  userId: string;
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
    },
    userId: {
      type: String,
      required: [true, 'Please provide userID'],
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

// Check if the password matches entered password in db

const Tickets = mongoose.model<ITickets>('Tickets', ticketsSchema);

export default Tickets;
