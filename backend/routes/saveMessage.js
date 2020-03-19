const express = require('express');
const nodemailer = require('nodemailer');


const router = express.Router();

router.post('/', async (req, res) => {
  const { textDoctor, email } = req.body;

  async function main() {
    // Generate test SMTP service account from ethereal.emailldlsof
    // Only needed if you don't have a real mail account for testing
    await nodemailer.createTestAccount();
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: 'smtp.mail.ru',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: 'patientlisa@mail.ru', // generated ethereal user
        pass: 'Lisa010203', // generated ethereal password
      },
    });

    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"Medical Assistant " <patientlisa@mail.ru>', // sender address
      to: email, // list of receivers
      subject: 'Вам сообщение от врача ', // Subject line
      text: 'Важная информация', // plain text body
      html: `<b>Здравствуйте!</b>
      <p>${textDoctor}</p>`, // html body
    });

    console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    // res.send('Письмо отправлено!');
  }
  main().catch(console.error);
  res.redirect('http://localhost:3000/');
});
module.exports = router;
