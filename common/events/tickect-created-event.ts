import { Subjects } from './subjects';

export interface TicketCreatedEvent {
  subject: Subjects.TicketCreated;
  data: {
    id: string;
    titile: string;
    price: string;
    userId: string;
  };
}
