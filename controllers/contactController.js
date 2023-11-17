const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');


// Validate user input
const contactValidate = [
  body('name', 'Enter a valid name').isLength({ min: 2 }),
  body('email', 'Enter a valid email').isEmail(),
  body('message', 'Message must be at least 5 characters').isLength({ min: 2 }),
];


const submitContactForm = async (req, res) => {
  try {
    // if validation errors, return bad request error 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Save to MongoDB
    const { name, email, message } = req.body;
    const newContact = new Contact({ name, email, message });
    await newContact.save();

    // Send email using EmailJS
    const template_id = process.env.EMAILJS_TEMPLATE_ID_CONTACT_PAGE;
    const service_id = process.env.EMAILJS_SERVICE_ID;
    const public_key = process.env.EMAILJS_PUBLIC_KEY;

    res.status(200).json({ message: 'Contact form submitted successfully!' });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  submitContactForm,
  contactValidate
};
