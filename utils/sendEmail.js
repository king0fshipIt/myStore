
const nodemailer = require('nodemailer');

const sendEmail = async options => {
  console.log(process.env.NODEMAILER_USER,process.env.NODEMAILER_PASS)
  var transporter = nodemailer.createTransport({
    service: process.env.NODEMAILER_SERVICE,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS
    }
  });
  const message = {
    from: `<${process.env.NODEMAILER_USER}>`,
    to: options.email_address,
    subject: options.subject,
    html: options.message
  };

  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;