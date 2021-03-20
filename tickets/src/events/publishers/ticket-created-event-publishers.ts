import { Stan } from 'node-nats-streaming';
import { Subjects, Publisher, TicketCreatedEvent } from 'common-ticketing';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;

  // src/controller/ticketsController.ts(20,56): error TS2554: Expected 0 arguments, but got 1.
  constructor(client: Stan) {
    super(client);

    //src/controller/ticketsController.ts(22,15): error TS2339: Property 'publish' does not exist on type 'TicketCreatedPublisher'.
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    // Object.setPrototypeOf(this, TicketCreatedPublisher.prototype);
  }
}
