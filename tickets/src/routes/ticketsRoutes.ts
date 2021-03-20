import express, { Request, Response } from 'express';
import {
  createTickets,
  getTicket,
  getAllTickets,
  updateTicket,
} from '../controller/ticketsController';
import { protect } from '../utils/protect';
const router = express.Router();

router.use(protect);
router.route('/').get(getAllTickets).post(createTickets);
router.route('/:id').get(getTicket).put(updateTicket);

export default router;
