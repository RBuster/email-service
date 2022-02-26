import { ResponseCodes } from "../const/codes";
import { Email } from "./../models/email";
import * as nodemailer from "nodemailer";

class EmailService {
  sendEmail(payload: Email): Promise<any> {
    // sgMail.setApiKey(process.env.API_KEY || '');
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });
    console.log("Payload", payload);
    const msg = {
      from: process.env.FROM_EMAIL || "",
      to: payload.emailAddress,
      subject: payload.subject || "No subject specified",
      html: payload.message
        ? `<p>${payload.message}</p>`
        : `<p>no message specified</p>`,
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
