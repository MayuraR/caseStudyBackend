const nodemailer = require("nodemailer");
const { getMaxListeners } = require("../Models/Member");
const details = require("./details.json");

async function reservationMail(res, member ,callback) {
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
      to: member.email , // list of receivers
      subject: "Welcome to Our Hotel!", // Subject line
      html: `<h1>Hi ${member.name}</h1><br>
      <h4>Thanks for reserving a room</h4>
      <p>Here are your reservation details</p>
      <p>Reservation Id : ${res._id}</p>
      <p>Check-In Date : ${res.checkInDate.getDate()}/${res.checkInDate.getMonth()+1}/${res.checkInDate.getFullYear()}</p>
      <p>Check-Out Date : ${res.checkOutDate.getDate()}/${res.checkOutDate.getMonth()+1}/${res.checkOutDate.getFullYear()}</p>
      <p>Room Number : ${res.roomNo}</p>
      <br>
      <p>Please note Check-In takes place 10:00 pm onwards. Carry your verification documents along with you.</p>
      <p>Have a great day!</p>
      
      <p>Regards</p>
      <p>Team Hotel.</p>`
    };
  
    // send mail with defined transport object
    let info = await transporter.sendMail(mailOptions);
  
    callback(info);
  }

  module.exports = { reservationMail }