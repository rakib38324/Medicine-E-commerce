import express, { NextFunction, Request, Response } from 'express';
import ValidateRequest from '../../middlewares/validateRequest';
import { UserValidations } from './userRegistration.validation';
import { userControllers } from './userRegistration.controller';
import { upload } from '../../utiles/sendImagetoLocalFile';
import Auth from '../../middlewares/Auth';
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

router.get('/', Auth('admin', 'superAdmin'), userControllers.getAllUsers);
router.get('/:id', Auth('admin', 'superAdmin'), userControllers.getSingleUser);

router.patch(
  '/update-user/:id',
  Auth('superAdmin'),
  ValidateRequest(UserValidations.updateUserValidationSchema),
  userControllers.updateUsers,
);

export const userRouter = router;
