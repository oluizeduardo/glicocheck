// Necessary to work with .env files.
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const usersRouter = require('./routes/usersRouter');
const glucoseRouter = require('./routes/glucoseRouter');
const markerMealRouter = require('./routes/markerMealRouter');
const securityRouter = require('./routes/securityRouter');

const app = express();

const port = process.env.PORT || 3000;

// MORGAN is used to log requests.
app.use (morgan ('common'));
app.use (express.json());
app.use (cors());

app.use ('/api/users', usersRouter);
app.use ('/api/glucose', glucoseRouter);
app.use ('/api/markermeal', markerMealRouter);
app.use ('/api/security', securityRouter);


// Inicialize the server.
app.listen(port, function () {
    console.log(`Server running on ${port}.`);
})