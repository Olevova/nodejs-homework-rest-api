const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const { SENDGRID_API_KEY, FROM_MAIL } = process.env;
sgMail.setApiKey(SENDGRID_API_KEY);

const sendMail = async (date) => {
    const mail = { ...date, from: FROM_MAIL }
    try {
        await sgMail.send(mail);
        return true;
    } catch (error) {
        return error;
    }
};

module.exports = sendMail