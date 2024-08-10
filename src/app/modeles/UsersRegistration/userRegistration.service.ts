import httpStatus from 'http-status';
import { TUser } from './userRegistration.interface';
import AppError from '../../errors/appError';
import { User } from './userRegistration.model';
import { USER_ROLE } from './user.constent';
import { configDotenv } from 'dotenv';

const createUserIntoDB = async (file: any, payload: TUser) => {
  const { email, name, password } = payload;
  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'User already exists! Duplicate email.',
    );
  }

  if (payload?.role === 'super-admin' || payload?.role === 'admin') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Only Super admin can create Admin or Super Admin account.',
    );
  }
  const userInfo = {
    email,
    name,
    password,
    img: file?.path,
    role: USER_ROLE.user,
    passwordChangedAt: new Date(),
  };

  const user = await User.create(userInfo);

  if (user) {
    const result = await User.aggregate([
      {
        $match: { email: user?.email },
      },
      {
        $project: {
          password: 0,
          passwordChangedAt: 0,
          __v: 0,
        },
      },
    ]);
    return result[0];
  }
};

export const UserServices = {
  createUserIntoDB,
};
