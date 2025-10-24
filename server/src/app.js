const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const apiRoutes = require('./routes');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');
const { getCorsOptions } = require('./config/cors');

dotenv.config();

function createApp() {
  const app = express();

  // Built-in middlewares
  app.use(express.json());
  // Also accept URL-encoded form bodies (e.g., application/x-www-form-urlencoded)
  app.use(express.urlencoded({ extended: true }));

  // CORS for REST API
  app.use(cors(getCorsOptions()));

  // Mount API routes
  app.use('/api', apiRoutes);

  // Health check
  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  // 404 and error handlers
  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };