import express from 'express';
import {
  createPayments,
  getAllPayments,
} from '../controller/paymentsController';

import { protect } from '../utils/protect';

const router = express.Router();

router.use(protect);

router.route('/').get(getAllPayments).post(createPayments);
// router.route('/:id').get(getOrder).delete(deleteOrder);

export default router;
