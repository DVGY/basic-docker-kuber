import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-event-publisher';
console.clear();

// stan is client here
const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
});

stan.on('connect', async () => {
  console.log('publisher connected to NATS server');

  const publisher = new TicketCreatedPublisher(stan);
  try {
    await publisher.publish({
      id: '123',
      titile: 'lol',
      price: '20',
      userId: 'asdffsdafadsffdas',
    });
  } catch (error) {
    throw error;
  }
});
