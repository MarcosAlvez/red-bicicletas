const nodemailer = require('nodemailer');

const mailConfig = {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'rickey.ondricka9@ethereal.email',
        pass: 'vh4SPYAnqzD1NzpxDc'
    }
};

module.exports = nodemailer.createTransport(mailConfig);
