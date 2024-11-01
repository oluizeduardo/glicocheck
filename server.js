/* eslint-disable max-len */
require('dotenv').config();
const express = require('express');
const path = require('path');
const packageJson = require('./package.json');

const app = express();

// Disable X-Powered-By header.
app.disable('x-powered-by');

const environment = process.env.ENVIRONMENT || 'dev';

if (environment === 'dev') {
  app.use((req, res, next) => {
    if (!req.originalUrl.startsWith('/includes')) {
      console.log(`[${req.method}] ${req.originalUrl}`);
    }
    next();
  });
}

app.use(express.json({limit: '2mb'}));
app.use(express.urlencoded({extended: true}));
app.use('/', express.static(path.join(__dirname, '/src/public')));

// Prevents the browser from storing pages in the cache.
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '/src/public/404.html'));
});

const port = process.env.PORT || 3000;

const appVersion = packageJson.version;

// Inicialize the server.
app.listen(port, function() {
  console.log(`Glicocheck [v${appVersion}] running on port [${port}] with profile [${environment}].`);
});

module.exports = app;
