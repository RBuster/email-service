import { ResponseCodes } from '../const/codes';
import {Email} from './../models/email'
import * as sgMail from '@sendgrid/mail';

class EmailService {
    sendEmail(payload: Email): Promise<any> {
        sgMail.setApiKey(process.env.API_KEY || '');
        console.log('Payload', payload);
        const msg = {
            from: process.env.FROM_EMAIL || '',
            to: payload.emailAddress,
            subject: payload.subject || 'No subject specified',
            html: payload.message ? `<p>${payload.message}</p>` : `<p>no message specified</p>`
        };
        console.log('Email MSG', msg);
        return sgMail.send(msg).then((info: any) => {
            return {
                data: {
                    status: ResponseCodes.SUCCESS
                }
            }
        })
        .catch((err: any) => {
            return {
                error: {
                  code: err.code,
                  message: err.message,
                  status: ResponseCodes.FAILURE,
                  fullError: err
                }
              }
        });
    }
}
const emailService = new EmailService();
export {emailService};