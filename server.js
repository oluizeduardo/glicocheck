// Necessary to work with .env files.
require('dotenv').config();

const logger = require('./src/loggerUtil/logger');
const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const usersRouter = require('./src/routes/usersRouter');
const glucoseRouter = require('./src/routes/glucoseRouter');
const markerMealRouter = require('./src/routes/markerMealRouter');
const securityRouter = require('./src/routes/securityRouter');
const resetPasswordRouter = require('./src/routes/resetPasswordRouter');
const carbsCountingRouter = require('./src/routes/carbsCountingRouter');
const genderRouter = require('./src/routes/genderRouter');
const diabetesTypeRouter = require('./src/routes/diabetesTypeRouter');
const bloodTypeRouter = require('./src/routes/bloodTypeRouter');
const systemHealthCheckRouter = require('./src/routes/systemHealthCheckRouter');
const systemConfigRouter = require('./src/routes/systemConfigurationRouter');

const app = express();

// CORS configuration.
app.use(cors());

// Specific CORS configuration.
// app.use(
//   cors({
//     origin: 'http://localhost:3000', // Aloowed domain.
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//   })
// );

// Disclosing the fingerprinting of this web technology.
app.disable('x-powered-by');

// Custom logging middleware
app.use((req, res, next) => {
  // Excludes from log.
  if (!req.originalUrl.startsWith('/includes') &&
      !req.originalUrl.endsWith('.html')) {
    logger.info(`[${req.method}] ${req.originalUrl}`);
  }
  next();
});

// Log requests in the console.
app.use(morgan('common'));
app.use(express.json({limit: '2mb'}));

app.use('/api/users', usersRouter);
app.use('/api/glucose', glucoseRouter);
app.use('/api/markermeal', markerMealRouter);
app.use('/api/security', securityRouter);
app.use('/api/reset', resetPasswordRouter);
app.use('/api/carbscounting', carbsCountingRouter);
app.use('/api/gender', genderRouter);
app.use('/api/diabetestype', diabetesTypeRouter);
app.use('/api/bloodtype', bloodTypeRouter);
app.use('/api/ping', systemHealthCheckRouter);
app.use('/api/systemconfiguration', systemConfigRouter);

app.use(express.urlencoded({extended: true}));
app.use('/', express.static(path.join(__dirname, '/src/public')));

const port = process.env.PORT || 3000;

// Inicialize the server.
app.listen(port, function() {
  logger.info(`Server running on ${port}.`);
});

module.exports = app;
