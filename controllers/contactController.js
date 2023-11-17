const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');
const { MongoClient } = require('mongodb');

require('dotenv').config();// Load environment variables from .env file

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


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

    // extract user inputs
    const { name, email, message } = req.body;
    const data = new Contact({ name, email, message });

    // save in contactForm collection of studybuddy Database in Mongo atlas
    try {
      await client.connect();
      const database = client.db('studybuddy');
      const collection = database.collection('contactForm');
  
      // write to the 'contactForm' collection
      await collection.insertOne(data);
  
      console.log('Data written to studybuddy.contactForm collection successfully.');
    } finally {
      await client.close();
    }

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
