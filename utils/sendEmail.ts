import { SentMessageInfo } from 'nodemailer';
import mailer from '../core/mailer';

interface sendEmailProps {
  emailFrom: string;
  emailTo: string;
  subject: string;
  html: string;
}

export const sendEmail = (
  { emailFrom, emailTo, subject, html }: sendEmailProps,
  callback?: (err: Error | null, info: SentMessageInfo) => void
) => {
  mailer.sendMail(
    {
      from: emailFrom,
      to: emailTo,
      subject,
      html,
    },
    callback ||
      function (err: Error | null, info: SentMessageInfo) {
        if (err) {
          console.log(err);
        } else {
          console.log(info);
        }
      }
  );
};
