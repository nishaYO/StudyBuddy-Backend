require("dotenv").config();
const nodemailer = require("nodemailer");

const sendMail = async (email, content) => {
  try {
    // Create a nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // Define the email message
    const mailOptions = {
      from: process.env.MAIL_FROM,
      to: email,
      subject: content.subject,
      text: content.text,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending mail:", error.message);
    return false;
  }
};

module.exports = sendMail;
