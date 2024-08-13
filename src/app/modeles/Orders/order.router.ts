import express from 'express';
import ValidateRequest from '../../middlewares/validateRequest';
import Auth from '../../middlewares/Auth';
import { orderValidations } from './order.validation';
import { orderControllers } from './order.controller';

const router = express.Router();

router.post(
  '/order-place',
  Auth('admin', 'superAdmin'),
  ValidateRequest(orderValidations.createOrderValidationSchema),
  orderControllers.createOrder,
);

router.get(
  '/',
  Auth('admin', 'superAdmin', 'user'),
  orderControllers.getAllOrder,
);

router.get(
  '/:id',
  Auth('admin', 'superAdmin', 'user'),
  orderControllers.getsingleOrder,
);

router.patch(
  '/:id',
  Auth('admin', 'superAdmin'),
  ValidateRequest(orderValidations.updateOrderValidationSchema),
  orderControllers.updateVariant,
);

export const orderRouter = router;
