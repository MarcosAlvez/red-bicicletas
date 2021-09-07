const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');

let mailConfig;

if (process.env.NODE_ENV === 'production'){
    const options = {
        server:	'smtp.sendgrid.net',
        port: 587,
        auth: {
            user: 'apikey',
            api_key: process.env.SG_API_SECRET
        }
    }
    mailConfig = sgTransport(options);
}else{
    if(process.env.NODE_ENV === 'staging'){
        console.log('***STAGING.ENV***');
        const options = {
            server:	'smtp.sendgrid.net',
            port: 587,
            auth: {
                user: 'apikey',
                api_key: process.env.SG_API_SECRET
            }
        }
        mailConfig = sgTransport(options);
    }else {
        //mails catched by ethereal
        mailConfig = {
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: process.env.ethereal_usr,
                pass: process.env.ethereal_pwd
            }
        }
    }

}

module.exports = nodemailer.createTransport(mailConfig);
