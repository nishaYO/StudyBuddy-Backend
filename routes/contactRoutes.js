const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

router.post('/submit', contactController.contactValidate, contactController.submitContactForm);
// The above line defines a route for handling HTTP POST requests to the /submit endpoint. When a POST request is made to this endpoint, the submitContactForm function from the contactController is called.

module.exports = router;
