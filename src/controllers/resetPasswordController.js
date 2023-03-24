const ResetPasswordHTMLMessage = require('../utils/resetPasswordHTMLMessage');
const Messages = require('../utils/messages');
const database = require('../db/dbconfig.js');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
/**
 * ResetPasswordController.
 *
 * Contains methods to reset the user password.
 */
class ResetPasswordController {
  /**
   * Handle the start process to reset the user password.
   * @param {Request} req The request object.
   * @param {Response} res The response object.
   */
  static handleForgotPassword = async (req, res) => {
    const {email} = req.body;
    await database('users')
        .where('email', email)
        .select('id')
        .then((users) => {
          if (users.length) {
            const resetToken = ResetPasswordController.generateResetToken();
            ResetPasswordController.sendResetEmail(email, resetToken, res);
          } else {
            res.status(404).json({message: Messages.NOTHING_FOUND});
          }
        });
  };

  /**
   * Creates a reset password token.
   * @return {string} A hexadecimal string representing
   * the reset password token.
   */
  static generateResetToken = () => {
    return crypto.randomBytes(20).toString('hex');
  };

  /**
   * This function sends a reset password message to the informed email address.
   * @param {string} destination The email address that will
   * receive the reset password message.
   * @param {string} resetToken The hexadecimal string representing
   * the reset password token.
   * @param {Response} res The response object.
   */
  static async sendResetEmail(destination, resetToken, res) {
    const host = process.env.EMAIL_HOST;
    const port = process.env.EMAIL_PORT;
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    const transporter = nodemailer.createTransport({
      host: host,
      port: port,
      auth: {user, pass},
    });

    transporter
        .sendMail({
          from: user,
          to: destination,
          subject: 'Glicocheck - Reset password',
          html: ResetPasswordHTMLMessage.createHTMLMessage(resetToken),
        })
        .then(() => {
          // IN THE FUTURE, SAVE THE RESET TOKEN IN THE DATABASE.
          // Use the email destination and the reset token.
          // the reset token should be valid for 24hrs.
          // After 24 hrs the token should be expired.
          res.status(200).json({message: Messages.RESET_PASSWORD_MESSAGE_SENT});
        })
        .catch((error) => {
          res.status(500)
              .json({
                message: Messages.ERROR_SEND_RESET_PASSWORD_MESSAGE,
                details: error,
              });
        });
  }
}

module.exports = ResetPasswordController;
