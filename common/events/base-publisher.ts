import { Message, Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Publisher<T extends Event> {
  private client: Stan;
  abstract subject: T['subject']; // subject is the event we listen to (user-defined)

  constructor(client: Stan) {
    this.client = client;
  }

  // this method is equivalent to stan.publish()
  publish(data: T['data']): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.publish(this.subject, JSON.stringify(data), (err) => {
        if (err) {
          reject(err);
        }

        console.log('Event published');
        resolve();
      });
    });
  }
}
