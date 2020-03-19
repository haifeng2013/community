"use strict";
const nodemailer = require("nodemailer");
const config = require('../../config.json');

async function send() {
    let smtp = config.SMTP;
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: smtp.host,
        port: smtp.port,
        secure: false, //smtp.secure, // true for 465, false for other ports
        auth: {
        user: smtp.user, // generated ethereal user
        pass: smtp.pass // generated ethereal password
        }
    });
    

    // send mail with defined transport object
    let info = await transporter.sendMail({
        
        from: '"' + smtp.name + '" <' + smtp.user + '>', // sender address
        replyTo: '',
        to: "", // list of receivers
        subject: "Hello ✔ 1s", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>" // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

send().catch(console.error);