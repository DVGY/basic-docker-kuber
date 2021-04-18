import mongoose from 'mongoose';
import { app } from './app';
import { OrderCreatedListener } from './events/listneres/order-created-listeners';
import { OrderCancelledListener } from './events/listneres/order-cancelled-listener';
import { natsWrapper } from './NATSWrapper';

const start = async () => {
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error('JWT SECRET KEY is not defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('Mongo URI is not defined');
  }

  if (!process.env.NATS_URL) {
    throw new Error('NATS URI is not defined');
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS CLIENT ID is not defined');
  }

  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS CLUSTER ID is not defined');
  }

  await natsWrapper.connect(
    process.env.NATS_CLUSTER_ID,
    process.env.NATS_CLIENT_ID,
    process.env.NATS_URL
  );

  natsWrapper.client.on('close', () => {
    console.log('NATS Connection Closed');
    process.exit();
  });

  new OrderCreatedListener(natsWrapper.client).listen();
  new OrderCancelledListener(natsWrapper.client).listen();

  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
  console.log('DB Connected Successfully !!');

  app.listen(3000, () => console.log('Listeninig on port 3000!!'));
};
start();
