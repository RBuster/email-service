import * as functions from 'firebase-functions';
import {emailService} from './lib/resources/emailRA';
import { Email } from './lib/models/email';
import * as Ajv from 'ajv';
import { ResponseCodes } from './lib/const/codes';
import { emailValidationSchema } from './lib/validation/emailValidationConfig';
const express = require('express');
const cors = require('cors');

require('dotenv').config();

const app = express();
app.use(cors({ origin: true }));
app.post('/sendEmail', (req: any, res: any) => {
    let reqBody = req.body.data
    console.info('parsed', reqBody);
    let ajv = new Ajv({allErrors: true});
    let validate = ajv.compile(emailValidationSchema);
    let valid = validate(reqBody);
    if (!valid) {
        res.send({
            error: {
                code: 400,
                message: validate.errors,
                status: ResponseCodes.FAILURE,
                fullError: validate
              }
        });
    }
    let payload: Email = new Email(reqBody);
    return emailService.sendEmail(payload)
        .then((response: EmailResponse) => {
            res.send(response);
        });
});

app.get('/emailValidation', (req: any, res: any) => {
    res.send(emailValidationSchema);
});
exports.api = functions.https.onRequest(app);