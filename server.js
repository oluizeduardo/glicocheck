// Necessary to work with .env files.
require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const apiRouter = require('./routes/apiRouter');
// const clientRouter = require('./routes/clientRouter');

const app = express();

const port = process.env.PORT || 3000;

// MORGAN is used to log requests.
app.use (morgan ('common'));
app.use ('/api', apiRouter);
// app.use('/site', clientRouter)


// Inicialize the server.
app.listen(port, function () {
    console.log(`Server running at ${port}.`);
})