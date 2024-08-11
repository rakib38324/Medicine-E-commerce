import { USER_ROLE } from '../UsersRegistration/user.constent';

export type TLoginUser = {
  email: string;
  password: string;
};

export type EmailVerification = {
  email: string;
  token: string;
};

export type TUserRole = keyof typeof USER_ROLE;
