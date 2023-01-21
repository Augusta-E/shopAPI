//const sgMail = require('@sendgrid/mail');
const config = require('../config/index');
const nodemailer = require('nodemailer');
require('dotenv').config();

// module.exports = async ({ to, from, subject, text, html }) => {
//     try {
//         sgMail.setApiKey(config.app.sendgrid_Key);
//         await sgMail.send({
//             to,
//             from,
//             subject,
//             text,
//             html
//         });
//     } catch (error) {
//         console.log(`mailer: ${error}`);
//         return error;
//     }
//     return { message: 'Email sent' };
// };
exports.mail = async ({ from, to, subject, text, html }) => {
    try {
        const transport = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.GMAIL_ID,
                pass: process.env.GMAIL_PASSWORD
            }
        });
        await transport.sendMail({ from, to, subject, text, html });
    } catch (error) {
        return `mailer ${error}`;
    }
    return { message: 'Email sent:' };
};
