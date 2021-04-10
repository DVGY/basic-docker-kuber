import mongoose from 'mongoose';
import { app } from './app';
import { ExpirationCompleteListner } from './events/listeners/expiration-complete-listner';
import { TicketCreatedListner } from './events/listeners/ticket-created-listner';
import { TicketUpdatedListner } from './events/listeners/ticket-updated-listner';
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

  process.on('SIGINT', () => natsWrapper.client.close());
  process.on('SIGTERM', () => natsWrapper.client.close());

  new TicketCreatedListner(natsWrapper.client).listen();
  new TicketUpdatedListner(natsWrapper.client).listen();
  new ExpirationCompleteListner(natsWrapper.client).listen();

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
