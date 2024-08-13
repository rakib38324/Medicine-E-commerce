import express from 'express';
import ValidateRequest from '../../middlewares/validateRequest';
import Auth from '../../middlewares/Auth';
import { variantValidations } from './variant.validation';
import { variantControllers } from './variant.controller';

const router = express.Router();

router.post(
  '/create-variant',
  Auth('admin', 'superAdmin'),
  ValidateRequest(variantValidations.createVariantValidationSchema),
  variantControllers.createVariant,
);

router.patch(
  '/:id',
  Auth('admin', 'superAdmin'),
  variantControllers.updateVariant,
);

router.delete(
  '/:id',
  Auth('admin', 'superAdmin'),
  variantControllers.deleteVariant,
);

export const variantRouter = router;
