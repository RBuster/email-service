export const emailValidationSchema = {
    properties: {
        emailAddress: {type: 'string', format : 'email'},
        subject: {type: ['string', 'null']},
        message: {type: ['string', 'null']}
    }
}