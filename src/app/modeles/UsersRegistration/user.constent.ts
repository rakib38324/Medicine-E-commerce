import { createToken } from "../Auth/auth.utillis";

export const USER_ROLE = {
  superAdmin: 'super-admin',
  admin: 'admin',
  user: 'user',
} as const;


export function generateRandomSixDigitNumber(): number {
  // Generate a random number between 100000 and 999999
  const min = 100000;
  const max = 999999;
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNumber;
}



