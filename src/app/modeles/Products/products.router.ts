import express, { NextFunction, Request, Response } from 'express';
import ValidateRequest from '../../middlewares/validateRequest';
import { upload } from '../../utiles/sendImagetoLocalFile';
import Auth from '../../middlewares/Auth';
import { productValidations } from './products.validation';
import { productControllers } from './products.controller';

const router = express.Router();

router.post(
  '/create-product',
  Auth('admin', 'superAdmin'),
  upload.array('files'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);

    // Process uploaded files
    if (req.files) {
      // Extract file paths from the uploaded files
      const filePaths = (req.files as Express.Multer.File[]).map(
        (file) => file.path,
      );
      req.body.photos = filePaths; // Assign the file paths to the photos field
    }

    next();
  },
  ValidateRequest(productValidations.createProductSchema),
  productControllers.createProduct,
);

router.get(
  '/',
  Auth('admin', 'superAdmin', 'user'),
  productControllers.getAllProduct,
);

router.get(
  '/:id',
  Auth('admin', 'superAdmin', 'user'),
  productControllers.getSingleProduct,
);

router.patch(
  '/:id',
  Auth('admin', 'superAdmin', 'user'),
  upload.array('files'),
  (req: Request, res: Response, next: NextFunction) => {
    if (req?.body?.data) {
      req.body = JSON.parse(req.body.data);
    }

    // Process uploaded files
    if (req.files) {
      // Extract file paths from the uploaded files
      const filePaths = (req.files as Express.Multer.File[]).map(
        (file) => file.path,
      );
      req.body.photos = filePaths; // Assign the file paths to the photos field
    }

    next();
  },
  productControllers.updateSingleProduct,
);

router.delete(
  '/:id',
  Auth('admin', 'superAdmin', 'user'),
  productControllers.deleteSingleProduct,
);

router.post(
  '/delete-picture/:id',
  Auth('admin', 'superAdmin', 'user'),
  ValidateRequest(productValidations.picturePayload),
  productControllers.deleteProductPicture,
);

export const productRouter = router;
