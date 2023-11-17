const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const contactRoutes = require('./routes/contactRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const reportsRoutes = require('./routes/reportsRoutes');

require('dotenv').config();// Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/contact', contactRoutes);
// app.use('/session', sessionRoutes);
app.use('/reports', reportsRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
