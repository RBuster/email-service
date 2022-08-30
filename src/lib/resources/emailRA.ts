import { Email } from "./../models/email";
import * as sgMail from '@sendgrid/mail';
import { EmailResponse } from '../models/response';


class EmailService {
  async sendEmail(payload: Email): Promise<EmailResponse> {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');
    const msg = {
      from: process.env.FROM_EMAIL || "",
      to: payload.emailAddress,
      subject: payload.subject || "No subject specified",
      html: payload.message
        ? `<p>${payload.message}</p>`
        : `<p>no message specified</p>`,
    };
    try {
      await sgMail.send(msg);
      return {
        status: 'success'
      };
    } catch (err: any) {
      console.error(err);

      if (err?.response) {
        console.error(err.response.body)
        return {
          status: 'failure',
          error: {
            code: err.code,
            message: err.message,
            fullError: err,
          },
        }
      }
      return {
        status: 'failure',
        error: {
          code: err.code,
          message: err.message,
          fullError: err,
        },
      }
    }
  }
}
const emailService = new EmailService();
export { emailService };
