const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reportsController');

router.get('/fetch', reportsController.sendReports);

module.exports = router;