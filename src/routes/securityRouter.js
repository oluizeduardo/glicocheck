const express = require('express');
// eslint-disable-next-line new-cap
const securityRouter = express.Router();
const SecurityController = require('../controllers/securityController');

securityRouter.use(express.json());

securityRouter
    .post('/register', SecurityController.registerNewUser)
    .post('/password/validation', SecurityController.passwordValidation)
    .post('/login', SecurityController.doLogin);

module.exports = securityRouter;
