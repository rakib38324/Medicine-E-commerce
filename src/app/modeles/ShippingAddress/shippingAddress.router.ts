import express from 'express';
import ValidateRequest from '../../middlewares/validateRequest';
import Auth from '../../middlewares/Auth';
import { shippingAddressValidations } from './shippingAddress.validation';
import { shippingAddressControllers } from './shippingAddress.controller';

const router = express.Router();

router.post(
  '/create-address',
  Auth('admin', 'superAdmin', 'user'),
  ValidateRequest(shippingAddressValidations.shippingAddressSchema),
  shippingAddressControllers.createshippingAddress,
);

router.get(
  '/',
  Auth('admin', 'superAdmin', 'user'),
  shippingAddressControllers.getShippingAddress,
);

router.patch(
  '/:id',
  Auth('admin', 'superAdmin', 'user'),
  ValidateRequest(shippingAddressValidations.shippingAddressUpdatedSchema),
  shippingAddressControllers.updateShippingAddress,
);

router.delete(
  '/:id',
  Auth('admin', 'superAdmin', 'user'),
  shippingAddressControllers.deleteShippingAddress,
);

export const shippinAddressRouter = router;
