import mongoose, { Document, Schema } from 'mongoose';

export interface IPayments extends Document {
  orderId: string;
  stripeId: string;
}

const paymentsSchema: Schema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: ['true', 'Please provide a payment'],
    },
    stripeId: {
      type: String,
      required: ['true', 'Please provide a stripe Id'],
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

const Payments = mongoose.model<IPayments>('Payments', paymentsSchema);

export default Payments;
