import * as functions from 'firebase-functions';
import {emailService} from './lib/resources/emailRA';
import { Email } from './lib/models/email';
import * as Ajv from 'ajv';
import { ResponseCodes } from './lib/const/codes';
import { check } from 'express-validator';
import { emailValidationSchema } from './lib/validation/emailValidationConfig';
const express = require('express');

require('dotenv').config();

const app = express();

app.post('/sendEmail',[
    check('subject').trim().escape(),
    check('emailAddress').isEmail(),
    check('message').trim().escape()
    ], (req: any, res: any) => {
    let reqBody = req.body;
    let ajv = new Ajv({allErrors: true});
    let validate = ajv.compile(emailValidationSchema);
    let valid = validate(reqBody);
    if (!valid) {
        res.send({
            status: ResponseCodes.FAILURE,
            errorMessage: validate.errors
        });
    }
    let payload: Email = new Email(reqBody);
    return emailService.sendEmail(payload)
        .then((response: EmailResponse) => {
            res.send(response);
        });
});

exports.api = functions.https.onRequest(app);