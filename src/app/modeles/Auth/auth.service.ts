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
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Invalid User Information, Please create your account again.',
    );
  }

  //====> verify token
  const decoded = VerifyToken(token, config.jwt_access_secret as string);

  // console.log(decoded)
  if (decoded.email !== payload.email) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      `Invalid User Information, try again leater.`,
    );
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

const resendEmailVerification = async (payload: { email: string }) => {
  const { email } = payload;
  //===>check if the user is exists
  const isUserExists = await User.findOne({ email: email });

  if (!isUserExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Invalid User Information, Please create your account.',
    );
  }

  if (isUserExists?.verified) {
    throw new AppError(httpStatus.NOT_FOUND, 'Your email already verified.');
  }

  const jwtPayload = {
    email,
    name: isUserExists?.name,
    role: isUserExists?.role,
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
      
      <p>Dear ${isUserExists?.name},</p>
      <p>Thank you for registering with us. To complete your registration, please verify your email address by clicking on the following link:</p>
       <p>
       <a href="${resetUILink}" style="color: #007bff; text-decoration: none;">Click here to verify your email</a>
       </p>
      <p>This link is valid for 20 minutes. Please do not share this code with anyone.</p>
      <p>If you did not create an account using this email address, please ignore this email.</p>
      <p>Best regards,<br />Medicine E-Commerce</p>
    </div>
  `;

  sendEmail(subject, email, html);

  return {
    message: `Successfully Resend your verification link with ${email}. Please Check Your Email.`,
  };
};

const loginUser = async (payload: TLoginUser) => {
  //===>check if the user is exists

  const isUserExists = await User.isUserExistsByEmail(payload.email);

  if (!isUserExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'User not found! Check your Email.',
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

  if (!isUserExists?.verified) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You are not verified. Please verify your account.',
    );
  }

  //-====> access granted: send accessToken, RefreshToken
  const jwtPayload: TJwtPayload = {
    email: isUserExists?.email,
    name: isUserExists?.name,
    role: isUserExists?.role,
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
    throw new AppError(
      httpStatus.NOT_FOUND,
      'No Account found. PLease check your email.',
    );
  }

  const jwtPayload = {
    email: isUserExists?.email,
    name: isUserExists?.name,
    role: isUserExists?.role,
  };

  //===========> create token and sent to the client
  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    '20m',
  );

  const resetUILink = `${config.reset_password_ui_link}?email=${isUserExists.email}&token=${resetToken}`;
  const subject = 'Password Reset Link From Medicine E-commerce.';
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      
      <p>Dear ${isUserExists?.name},</p>
      <p>Please reset your password by clicking on the following link:</p>
       <p>
       <a href="${resetUILink}" style="color: #007bff; text-decoration: none;">Click here to reset your password</a>
       </p>
      <p>This link is valid for 20 minutes. Please do not share this code with anyone.</p>
      <p>If you did not request to reset your password, please ignore this email.</p>
      <p>Best regards,<br />Medicine E-Commerce</p>
    </div>
  `;

  sendEmail(subject, isUserExists.email, html);

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

const getMeFromDB = async (email: string) => {
  const result = await User.aggregate([
    {
      $match: { email: email },
    },
    {
      $project: {
        password: 0,
        passwordChangedAt: 0,
        __v: 0,
      },
    },
  ]);
  if (result?.length > 0) {
    return result[0];
  } else {
    throw new AppError(httpStatus.NOT_FOUND, 'This user not found!');
  }
};

export const AuthServices = {
  emailVerification,
  resendEmailVerification,
  loginUser,
  changePassword,
  forgetPassword,
  resetPassword,
  getMeFromDB,
};
