const Joi = require('joi');
const phoneRegexp = /\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/;

const userSchema = Joi.object({
    name: Joi.string().required('ok'),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    phone: Joi.string().pattern(phoneRegexp).required()
});
const userUpdateSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    phone: Joi.string().pattern(phoneRegexp)
});

const userUpdateStatusSchema = Joi.object({
    favorite: Joi.bool().required()
});

const authSchema = Joi.object({
    password: Joi.string().required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    subscription: Joi.string(),
})


module.exports = {
    userSchema,
    userUpdateSchema,
    userUpdateStatusSchema,
    authSchema
}