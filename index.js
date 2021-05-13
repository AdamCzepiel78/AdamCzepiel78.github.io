const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

// async..await is not allowed in global scope, must use a wrapper
let main = async function(data) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'adam.czepiel52080@gmail.com', // generated ethereal user
            pass: '123hallo123$' // generated ethereal password
        }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: `${data.fullname} <${data.email}>`, // sender address
        to: 'adam.czepiel@gmx.de', // list of receivers
        subject: 'Portfolio Connection', // Subject line
        text: data.message, // plain text body
        html: `<p>${data.message}` // html body
    });

    console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile('public/index.html');
});

app.post('/message', (req,res) => {
  
  let emailData = req.body;
  
  let resultMail = main(emailData).then(()=>{
    emailData.error = false;
    res.json(emailData);
  }).catch(()=>{res.json({error: true})});
})

app.listen(3000, () => console.log('server started'));