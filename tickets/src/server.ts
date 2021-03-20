import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './NATSWrapper';

const start = async () => {
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error('JWT SECRET KEY is not defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('Mongo URI is not defined');
  }

  await natsWrapper.connect(
    'ticketing',
    'sadwew',
    'http://nats-streaming-srv:4222'
  );

  natsWrapper.client.on('close', () => {
    console.log('NATS Connection Closed');
    process.exit();
  });

  process.on('SIGINT', () => natsWrapper.client.close());
  process.on('SIGTERM', () => natsWrapper.client.close());

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
