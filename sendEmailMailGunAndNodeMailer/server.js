const nodemailer = require('nodemailer');
const nodemailerMailGun = require('nodemailer-mailgun-transport');


const auth = {
  auth: {
    api_key: '41f135d37ab1d57cda971d2098cf6cc2-19f318b0-ace2f0d3',
    domain: 'sandbox73d0a061cbb649398a867d25f43fa3e7.mailgun.org'
  }
}



let transporter = nodemailer.createTransport(nodemailerMailGun(auth))


const mailOptions = {
  from: 'Excited User <me@samples.mailgun.org>',
  to: 'habibahmedmagdy@gmail.com',
  subject: "Testmail",
  html: '<p>This is a mail</p>'

}


transporter.sendMail(mailOptions, function (err, data) {
  if (err) {
    console.log('Error: ' + err);
  }
  else {
    console.log('Message Sent!!!!')
  }
})

