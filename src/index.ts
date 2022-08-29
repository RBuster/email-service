import {emailService} from './lib/resources/emailRA';
import { Email } from './lib/models/email';
import * as Ajv from 'ajv';
import { ResponseCodes } from './lib/const/codes';
import { emailValidationSchema } from './lib/validation/emailValidationConfig';
import express = require('express');
import cors = require('cors');

require('dotenv').config();

const app = express();
const port = 3000;

app.use(cors({ origin: true }));
app.post('/sendEmail', (req: any, res: any) => {
    const reqBody = req.body.data
    console.info('parsed', reqBody);
    const ajv = new Ajv({allErrors: true});
    const validate = ajv.compile(emailValidationSchema);
    const valid = validate(reqBody);
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
    const payload: Email = new Email(reqBody);
    return emailService.sendEmail(payload)
        .then((response: EmailResponse) => {
            res.send(response);
        });
});

app.get('/emailValidation', (req: any, res: any) => {
    res.send(emailValidationSchema);
});

app.listen(port, () => {
    console.log(`Email service app listening on http://localhost:${port}`)
  })