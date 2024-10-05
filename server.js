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

const port = process.env.PORT || 3000;

const appVersion = packageJson.version;

// Inicialize the server.
app.listen(port, function() {
  console.log(`Glicocheck v${appVersion} running on ${port}.`);
});

module.exports = app;
