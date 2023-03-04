const express = require('express');
const securityRouter = express.Router();
const SecurityController = require('../controllers/securityController');

securityRouter
    .post('/register', express.json(), SecurityController.registerNewUser)
    .post('/password/validation', express.json(), SecurityController.passwordValidation)
    .post('/login', express.json(), SecurityController.doLogin);

module.exports = securityRouter;