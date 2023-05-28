// Necessary to work with .env files.
require('dotenv').config();

const express = require('express');
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
const systemConfigurationRouter = require('./src/routes/systemConfigurationRouter');

const app = express();
// Disclosing the fingerprinting of this web technology.
app.disable('x-powered-by');

const port = process.env.PORT || 3000;

// MORGAN is used to log requests.
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
app.use('/api/systemconfiguration', systemConfigurationRouter);

app.use(express.urlencoded({extended: true}));
app.use('/', express.static(path.join(__dirname, '/src/public')));

// Inicialize the server.
app.listen(port, function() {
  console.log(`Server running on ${port}.`);
});
