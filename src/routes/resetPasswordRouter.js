/* eslint-disable max-len */
const express = require('express');
// eslint-disable-next-line new-cap
const resetPasswordRouter = express.Router();
const ResetPasswordController = require('../controllers/resetPasswordController');

resetPasswordRouter.use(express.json());

resetPasswordRouter
    .post('/forgot-password', ResetPasswordController.handleForgotPassword)
    .get('/:resetToken', ResetPasswordController.handleResetPassword)
    .get('/cancel/:resetToken', ResetPasswordController.handleCancelResetRequest)
    .put('/password', ResetPasswordController.updateUserPassword);

module.exports = resetPasswordRouter;
