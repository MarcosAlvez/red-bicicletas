const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'rickey.ondricka9@ethereal.email',
        pass: 'vh4SPYAnqzD1NzpxDc'
    }
});

module.exports = transporter;
