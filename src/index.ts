import * as dotenv from 'dotenv'
import {emailService} from './lib/resources/emailRA';
import { Email } from './lib/models/email';
import * as Ajv from 'ajv';
import { ResponseCodes } from './lib/const/codes';
import { emailValidationSchema } from './lib/validation/emailValidationConfig';
import express = require('express');
import cors = require('cors');
import { EmailResponse } from './lib/models/respoinse';

dotenv.config();

const app = express();
const port = 3000;

app.use(cors({ origin: true }));
app.use(express.json())
app.post('/sendEmail', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const reqBody = req.body || null;
    if(!reqBody){
        res.send({
            error: {
                code: 400,
                message: 'No Payload',
                status: ResponseCodes.FAILURE
              }
        });
        throw new Error('No Payload in request')
    }
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
        throw new Error(validate.errors?.join(', '))
    }
    const payload: Email = new Email(reqBody);
    console.log(payload);
    return emailService.sendEmail(payload)
        .then((response: EmailResponse) => {
            if (response.errorMessage) {
                next(response.errorMessage) // Pass errors to Express.
            } else {
                res.send(response)
            }
        });
});

app.get('/emailValidation', (req: express.Request, res: express.Response) => {
    res.send(emailValidationSchema);
});

app.listen(port, () => {
    console.log(`Email service app listening on http://localhost:${port}`)
  })