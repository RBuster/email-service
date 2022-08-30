export const emailValidationSchema = {
    type: 'object',
    properties: {
        emailAddress: {type: 'string', format : 'email'},
        subject: {type: ['string', 'null']},
        message: {type: ['string', 'null']}
    },
    required: ['emailAddress'],
    additionalProperties: false
}