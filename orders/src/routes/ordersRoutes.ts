import express, { Request, Response } from 'express';
import {
  createOrders,
  getOrder,
  getAllOrders,
  deleteOrder,
} from '../controllers/ordersController';

import { protect } from '../utils/protect';

const router = express.Router();

router.use(protect);

router.route('/').get(getAllOrders).post(createOrders);
router.route('/:id').get(getOrder).delete(deleteOrder);

export default router;
