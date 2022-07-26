// Necessary to work with .env files.
require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const usersRouter = require('./routes/usersRouter');
const glucoseRouter = require('./routes/glucoseRouter');
const markerMealRouter = require('./routes/markerMealRouter');

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

// MORGAN is used to log requests.
app.use (morgan ('common'));
app.use ('/api/users', usersRouter);
app.use ('/api/glucose', glucoseRouter);
app.use ('/api/markermeal', markerMealRouter);


// Inicialize the server.
app.listen(port, function () {
    console.log(`Server running at ${port}.`);
})