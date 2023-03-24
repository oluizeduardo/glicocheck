// Necessary to work with .env files.
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const usersRouter = require('./src/routes/usersRouter');
const glucoseRouter = require('./src/routes/glucoseRouter');
const markerMealRouter = require('./src/routes/markerMealRouter');
const securityRouter = require('./src/routes/securityRouter');
const resetPasswordRouter = require('./src/routes/resetPasswordRouter');

const app = express();

const port = process.env.PORT || 3000;

// MORGAN is used to log requests.
app.use(morgan('common'));
app.use(express.json({limit: '2mb'}));
app.use(cors());

app.use('/api/users', usersRouter);
app.use('/api/glucose', glucoseRouter);
app.use('/api/markermeal', markerMealRouter);
app.use('/api/security', securityRouter);
app.use('/api/reset', resetPasswordRouter);

app.use(express.urlencoded({extended: true}));
app.use('/site', express.static(path.join(__dirname, '/src/public')));

// Inicialize the server.
app.listen(port, function() {
  console.log(`Server running on ${port}.`);
});
