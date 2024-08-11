import httpStatus from 'http-status';
import { TUser } from './userRegistration.interface';
import AppError from '../../errors/appError';
import { User } from './userRegistration.model';
import { USER_ROLE } from './user.constent';
import { createToken } from '../Auth/auth.utillis';
import config from '../../config/config';
import { sendEmail } from '../../utiles/sendEmail';

const createUserIntoDB = async (file: any, payload: TUser) => {
  const { email, name, password } = payload;
  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'User already exists! Duplicate email.',
    );
  }

  if (payload?.role === 'superAdmin' || payload?.role === 'admin') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Only Super admin can create Admin or Super Admin account.',
    );
  }

  const jwtPayload = {
    email,
    name,
    role: 'user',
  };
  //===========> create token and sent to the client
  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    '20m',
  );

  const resetUILink = `${config.email_vErification_ui_link}?email=${email}&token=${resetToken}`;

  const subject = 'Verification email from Medicine E-commerce.';

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      
      <p>Dear ${name},</p>
      <p>Thank you for registering with us. To complete your registration, please verify your email address by clicking on the following link:</p>
       <p>
       <a href="${resetUILink}" style="color: #007bff; text-decoration: none;">Click here to verify your email</a>
       </p>
      <p>This code is valid for 20 minutes. Please do not share this code with anyone.</p>
      <p>If you did not create an account using this email address, please ignore this email.</p>
      <p>Best regards,<br />Medicine E-Commerce</p>
    </div>
  `;

  sendEmail(subject, email, html);

  const userInfo = {
    email,
    name,
    password,
    img: file?.path,
    role: USER_ROLE.user,
    verified: false,
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
          verified: 0,
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
