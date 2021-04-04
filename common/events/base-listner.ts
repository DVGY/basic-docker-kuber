import { Message, Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Listener<T extends Event> {
  protected client: Stan;
  abstract queueGroupName: string; // queueGroupName is the queue group inside nats streaming server that we subscribe to (user-defined)
  abstract subject: T['subject']; // subject is the event we listen to (user-defined)
  abstract onMessage(data: T['data'], msg: Message): void; //(user-defined)
  protected ackWaitTime = 5 * 1000;

  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setManualAckMode(true)
      .setAckWait(this.ackWaitTime)
      .setDeliverAllAvailable()
      .setDurableName(this.queueGroupName);
  }

  // this is equivalent to stan.subscribe
  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on('message', (msg: Message) => {
      console.log(
        `Message recieved subject: ${this.subject} queue group: ${this.queueGroupName}`
      );

      const parsedData = this.parseMessage(msg);

      this.onMessage(parsedData, msg);
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === 'string'
      ? JSON.parse(data)
      : JSON.parse(data.toString('utf-8'));
  }
}
