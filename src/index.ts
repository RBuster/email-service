import * as dotenv from 'dotenv'
import {emailService} from './lib/resources/emailRA';
import { Email } from './lib/models/email';
import * as Ajv from 'ajv';
import { emailValidationSchema } from './lib/validation/emailValidationConfig';
import express = require('express');
import cors = require('cors');
import { EmailResponse } from './lib/models/response';

dotenv.config();

const app = express();
const port = 3000;

app.use(cors({ origin: true }));
app.use(express.json())
app.post('/sendEmail', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const reqBody = req.body || null;
    if(!reqBody){
        res.send({
            status: 'failure',
            error: {
                code: 500,
                message: 'No Payload',
                fullError: 'No Payload',
            }
        });
        throw new Error('No Payload in request')
    }
    const ajv = new Ajv({allErrors: true});
    const validate = ajv.compile(emailValidationSchema);
    const valid = validate(reqBody);
    if (!valid) {
        res.send({
            status: 'failure',
            error: {
                code: 500,
                message: validate.errors,
                fullError: validate
            }
        });
        throw new Error(validate.errors?.join(', '))
    }
    const payload: Email = new Email(reqBody);
    return emailService.sendEmail(payload)
        .then((response: EmailResponse) => {
            if (response.error) {
                next(response.error.message) // Pass errors to Express.
            } else {
                res.send(response)
            }
        });
});

app.get('/emailValidation', (req: express.Request, res: express.Response) => {
    res.send(emailValidationSchema);
});

app.listen(port, () => {
    console.log(`Email service app listening on port ${port}`)
  })