import { ResponseCodes } from "../const/codes";
import { Email } from "./../models/email";
import * as nodemailer from "nodemailer";

class EmailService {
  sendEmail(payload: Email): Promise<any> {
    // sgMail.setApiKey(process.env.API_KEY || '');
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      sendmail: true,
      newline: 'unix',
    });
    console.log("Payload", payload);
    const msg = {
      from: process.env.FROM_EMAIL || "",
      to: payload.emailAddress,
      subject: payload.subject || "No subject specified",
      text: 'I hope this message gets delivered!'
    };
    console.log("Email MSG", msg);
    return transporter
      .sendMail(msg)
      .then((info: any) => {
        return {
          data: {
            status: ResponseCodes.SUCCESS,
          },
        };
      })
      .catch((err: any) => {
        return {
          error: {
            code: err.code,
            message: err.message,
            status: ResponseCodes.FAILURE,
            fullError: err,
          },
        };
      });
  }
}
const emailService = new EmailService();
export { emailService };
