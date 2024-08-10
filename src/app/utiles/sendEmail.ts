import nodemailer from 'nodemailer';
import config from '../config/config';

export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.NODE_ENV === 'develop',
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: 'aminul15-3832@diu.edu.bd',
      pass: 'jjvk pqse pdxp nyjk',
    },
  });

  await transporter.sendMail({
    from: 'aminul15-3832@diu.edu.bd', // sender address
    to, // list of receivers
    subject:
      'ATG Social is send Password Reset Link and Reset your Password with in 20 minutes.', // Subject line
    text: '', // plain text body
    html, // html body
  });
};
