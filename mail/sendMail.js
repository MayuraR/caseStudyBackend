const nodemailer = require("nodemailer");
const details = require("./details.json");

async function sendMail(user, callback) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: details.email,
        pass: details.password
      }
    });
  
    let mailOptions = {
      from: 'hotelmanagement655@gmail.com', // sender address
      to: user.email, // list of receivers
      subject: "Welcome to Our Hotel!", // Subject line
      html: `<h1>Hi ${user.name}</h1><br>
      <h4>Thanks for joining us</h4>
      <p>Here is your membership ID</p>
      <h4>MemberId: ${user._id}</h4>
      <p>Please use it everytime you make a reservation</p>
      <p>Have a great day!</p>
      
      <p>Regards</p>
      <p>Team Hotel.</p>`
    };
  
    // send mail with defined transport object
    let info = await transporter.sendMail(mailOptions);
  
    callback(info);
  }

  module.exports = { sendMail }