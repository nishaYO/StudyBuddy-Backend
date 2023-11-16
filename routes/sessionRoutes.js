const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

router.post('/process', sessionController.processSessionData);

module.exports = router;
