import { natsWrapper } from './NATSWrapper';

const start = async () => {
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
};
start();

process.on('SIGINT', () => natsWrapper.client.close());
process.on('SIGTERM', () => natsWrapper.client.close());
