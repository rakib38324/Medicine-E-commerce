import express, { NextFunction, Request, Response } from 'express';
import ValidateRequest from '../../middlewares/validateRequest';
import { upload } from '../../utiles/sendImagetoLocalFile';
import { CategoryValidations } from './categories.validation';
import { categoryControllers } from './categories.controller';
import Auth from '../../middlewares/Auth';

const router = express.Router();

router.post(
  '/create-category',
  Auth('admin', 'superAdmin'),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);

    // If there's a file uploaded, add it to req.body
    if (req.file) {
      req.body.thumbnail = req.file.path; // Assuming you're storing the file path
    }

    next();
  },
  ValidateRequest(CategoryValidations.categoryCreateValidationSchema),
  categoryControllers.createCategory,
);

router.get(
  '/',
  Auth('admin', 'superAdmin', 'user'),
  categoryControllers.getAllCategory,
);

router.get(
  '/:id',
  Auth('admin', 'superAdmin', 'user'),
  categoryControllers.getSingleCategory,
);

router.patch(
  '/:id',
  Auth('admin', 'superAdmin'),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);

    // If there's a file uploaded, add it to req.body
    if (req.file) {
      req.body.thumbnail = req.file.path; // Assuming you're storing the file path
    }

    next();
  },
  ValidateRequest(CategoryValidations.categoryUpdateValidationSchema),
  categoryControllers.updateSingleCategory,
);

router.delete(
  '/:id',
  Auth('admin', 'superAdmin'),
  categoryControllers.deleteSingleCategory,
);

export const categoryRouter = router;
