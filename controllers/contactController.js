const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');

// Validate the user input in contact form submission
const contactValidate = [
  body('name', 'Enter a valid name').isLength({ min: 2 }),
  body('email', 'Enter a valid email').isEmail(),
  body('message', 'Message must be at least 5 characters').isLength({ min: 5 }),
];

exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate user input
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ errors: validationErrors.array() });
    }

    // Save to MongoDB
    const newContact = new Contact({ name, email, message });
    await newContact.save();

    // Send email using Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'nishasinghal979@gmail.com',
      subject: 'Contact Form: Study Buddy',
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Contact form submitted successfully!' });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
