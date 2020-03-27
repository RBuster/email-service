import { ResponseCodes } from '../const/codes';
import {Email} from './../models/email'
import * as sgMail from '@sendgrid/mail';

class EmailService {
    sendEmail(payload: Email): Promise<EmailResponse> {
        sgMail.setApiKey(process.env.API_KEY || '');
        const msg = {
            from: process.env.FROM_EMAIL || '',
            to: payload.emailAddress,
            subject: payload.subject || 'No subject specified',
            html: payload.message ? `<p>${payload.message}</p>` : `<p>no message specified</p>`
        };
        return sgMail.send(msg).then((info: any) => {
            return {
                status: ResponseCodes.SUCCESS
            }
        })
        .catch((err: any) => {
            return {
                status: ResponseCodes.FAILURE,
                errorMessage: err.message
            }
        });
    }
}
const emailService = new EmailService();
export {emailService};