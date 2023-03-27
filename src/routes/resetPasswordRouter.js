const express = require('express');
const resetPasswordRouter = express.Router();
const ResetPasswordController = require('../controllers/resetPasswordController');

resetPasswordRouter
    .post('/forgot-password', express.json(), ResetPasswordController.handleForgotPassword)
    .get('/:resetToken', express.json(), ResetPasswordController.handleResetPassword)
    .get('/cancel/:resetToken', express.json(), ResetPasswordController.handleCancelResetRequest)
    .put('/password', express.json(), ResetPasswordController.updateUserPassword);

module.exports = resetPasswordRouter;
