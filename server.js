require('dotenv').config();
const express = require('express');
const path = require('path');
const helmet = require('helmet');

const app = express();

// Applies security headers.
app.use(helmet({
  contentSecurityPolicy: false,
}));

// Disclosing the fingerprinting of this web technology.
app.disable('x-powered-by');

// Custom logging middleware
app.use((req, res, next) => {
  // Excludes from log.
  if (!req.originalUrl.startsWith('/includes')) {
    console.log(`[${req.method}] ${req.originalUrl}`);
  }
  next();
});

app.use(express.json({limit: '2mb'}));

app.use(express.urlencoded({extended: true}));
app.use('/', express.static(path.join(__dirname, '/src/public')));

const port = process.env.PORT || 3000;

// Inicialize the server.
app.listen(port, function() {
  console.log(`Server running on ${port}.`);
});

module.exports = app;
