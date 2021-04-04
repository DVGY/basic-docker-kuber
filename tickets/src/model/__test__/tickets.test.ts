// Test for versioning of ticket docs

import Tickets from '../ticketsModel';

it('implements optimistic concurrency control', async (done) => {
  // Create an instace of ticket

  const ticket = await Tickets.create({
    title: 'MJ Paris ',
    price: '200',
    userId: 'as123',
  });

  // fetch the ticket twice
  const firstTicket = await Tickets.findById(ticket.id);
  const secondTicket = await Tickets.findById(ticket.id);

  // make two seperate changes to ticket twice
  firstTicket!.set({ price: '500' });
  // save the first fetched ticket
  await firstTicket!.save();

  // save the second fetched ticket
  try {
    await secondTicket!.save();
  } catch (error) {
    return done();
  }

  throw new Error('Optimistic concurrency failed');
});
