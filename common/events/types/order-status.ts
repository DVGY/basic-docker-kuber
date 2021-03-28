export enum OrderStatus {
  // Order is created (ticket is not reserved)
  Created = 'created',

  // Order expires before payment
  // Order is cancelled bcz ticket is reserved
  // User cancels order
  Cancelled = 'cancelled',

  // Order has successfully reserved the ticket
  AwaitingPayment = 'awaiting:payment',

  // Provided payment successfully
  Complete = 'complete',
}
