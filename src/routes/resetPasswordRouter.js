const express = require('express');
const resetPasswordRouter = express.Router();
const ResetPasswordController = require('../controllers/resetPasswordController');

resetPasswordRouter
    .post('/forgot-password', express.json(), ResetPasswordController.handleForgotPassword);

module.exports = resetPasswordRouter;
