// config/nodemailer.js

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey', //  valore fisso per SendGrid
    pass: process.env.SENDGRID_API_KEY, //API Key di SendGrid
  },
});

module.exports = transporter;
