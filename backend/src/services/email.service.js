const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD   // Gmail App Password, not your real password
    }
});

async function sendOutreachEmail({ toEmail, customerName, amount, currency, reasoning }) {
    const info = await transporter.sendMail({
        from: `"Recovery Team" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: `Action needed: payment of ${amount} ${currency} didn't go through`,
        text: `Hi ${customerName},

We noticed your recent payment of ${amount} ${currency} was unsuccessful. ${reasoning}

Please update your payment method or contact us if you need help.

- Recovery Team`
    });

    return info;
}

module.exports = { sendOutreachEmail };