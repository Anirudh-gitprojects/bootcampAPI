const nodemailer = require("nodemailer");
const dotenv=require('dotenv').config({path:'../config/config.env'})
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.SMTP_EMAIL,
    pass:process.env.SMTP_PASSWORD,
  },
});

const sendEmail=async(options)=> {
  // send mail with defined transport object
  const message = await transporter.sendMail({
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>` , // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    text: options.message, // plain text body
  });

  
  console.log("Message sent: %s", message.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

module.exports=sendEmail;