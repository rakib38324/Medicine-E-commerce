import httpStatus from 'http-status';
import { EmailVerification, TLoginUser } from './auth.interface';
import AppError from '../../errors/appError';
import { User } from '../UsersRegistration/userRegistration.model';
import { TJwtPayload, VerifyToken, createToken } from './auth.utillis';
import config from '../../config/config';
import { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { sendEmail } from '../../utiles/sendEmail';

const emailVerification = async (payload: EmailVerification) => {
  const { email, token } = payload;
  //===>check if the user is exists
  const isUserExists = await User.findOne({ email: email });

  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Invalid User Information, Please create your account again.');
  }

  //====> verify token
  const decoded = VerifyToken(token, config.jwt_access_secret as string);

  // console.log(decoded)
  if (decoded.email !== payload.email) {
    throw new AppError(httpStatus.FORBIDDEN, `Token is expired, try again leater.`);
  }

  await User.findOneAndUpdate(
    {
      email: email,
    },
    {
      verified: true,
    },
  );

  return { message: 'Email Verifired Successfully.' };
};

const loginUser = async (payload: TLoginUser) => {
  //===>check if the user is exists

  const isUserExists = await User.isUserExistsByUserName(payload.username);

  if (!isUserExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'User not found! Check your username.',
    );
  }

  ///====> checking if the password is correct
  const isPasswordMatch = await User.isPasswordMatched(
    payload?.password,
    isUserExists?.password as string,
  );

  if (!isPasswordMatch) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password is not match!!');
  }

  //-====> access granted: send accessToken, RefreshToken
  const jwtPayload: TJwtPayload = {
    email: isUserExists?.email,
    username: isUserExists?.username,
    _id: isUserExists?._id,
  };

  //===========> create token and sent to the client
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  //===========> create refresh token and sent to the client
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_access_expires_in as string,
  );

  return { user: jwtPayload, token: accessToken, refreshToken: refreshToken };
};

const changePassword = async (
  userData: JwtPayload,
  payload: { currentPassword: string; newPassword: string },
) => {
  //===>check if the user is exists
  const isUserExists = await User.isUserExistsByEmail(userData.email);

  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user not found!');
  }

  const currentPassword = payload?.currentPassword;
  const hashpassword = isUserExists?.password;

  ///====> checking if the given password and exists password is correct
  const isPasswordMatch = await User.isPasswordMatched(
    currentPassword,
    hashpassword,
  );
  if (!isPasswordMatch) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password is not match!!');
  }

  // ===> hash new password
  const newHasedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_round),
  );

  await User.findOneAndUpdate(
    {
      email: userData.email,
    },
    {
      password: newHasedPassword,
      passwordChangedAt: new Date(),
    },
  );

  return null;
};

const forgetPassword = async (email: string) => {
  const isUserExists = await User.isUserExistsByEmail(email);

  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user not found!');
  }

  const jwtPayload = {
    email: isUserExists?.email,
    username: isUserExists?.username,
    _id: isUserExists?._id,
  };

  //===========> create token and sent to the client
  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    '20m',
  );

  const resetUILink = `${config.reset_password_ui_link}?email=${isUserExists.email}&token=${resetToken}`;
  const subject =
    'Medicine E-commerce is send Password Reset Link and Reset your Password with in 20 minutes.';

  sendEmail(subject, isUserExists.email, resetUILink);

  return `Reset link sent your email: ${isUserExists.email}`;
};

const resetPassword = async (
  payload: { email: string; newPassword: string },
  token: string,
) => {
  const isUserExists = await User.isUserExistsByEmail(payload.email);

  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user not found!');
  }

  //====> verify token
  const decoded = VerifyToken(token, config.jwt_access_secret as string);

  // console.log(decoded)
  if (decoded.email !== payload.email) {
    throw new AppError(httpStatus.FORBIDDEN, `You are forbidden!!`);
  }

  ///===> hash new password
  const newHasedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_round),
  );

  await User.findOneAndUpdate(
    {
      email: decoded.email,
    },
    {
      password: newHasedPassword,
      passwordChangedAt: new Date(),
    },
  );

  return 'Your Password Changed Successfully';
};

export const AuthServices = {
  emailVerification,
  loginUser,
  changePassword,
  forgetPassword,
  resetPassword,
};
