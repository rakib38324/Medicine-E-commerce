import express, { NextFunction, Request, Response } from 'express';
import ValidateRequest from '../../middlewares/validateRequest';
import { UserValidations } from './userRegistration.validation';
import { userControllers } from './userRegistration.controller';
import { upload } from '../../utiles/sendImagetoCloudinary';
const router = express.Router();

router.post(
  '/user-registration',
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  ValidateRequest(UserValidations.createUserValidationSchema),
  userControllers.createUsers,
);

// router.post(
//   '/update-user',
//   Auth('superAdmin'),
//   ValidateRequest(UserValidations.updateUserValidationSchema),
//   userControllers.changePassword,
// );

export const userRouter = router;
