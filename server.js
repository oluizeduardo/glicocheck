// Necessary to work with .env files.
require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const usersRouter = require('./routes/usersRouter');
const glicemiaRouter = require('./routes/glicemiaRouter');

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

// MORGAN is used to log requests.
app.use (morgan ('common'));
app.use ('/api', usersRouter);
app.use ('/api', glicemiaRouter);


// Inicialize the server.
app.listen(port, function () {
    console.log(`Server running at ${port}.`);
})