const nodemailer = require('nodemailer');
const Messages = require('../utils/messages');
const ResetPasswordHTMLMessage = require('../utils/resetPasswordHTMLMessage');

// HTTP status code.
const OK = 200;
const INTERNAL_SERVER_ERROR = 500;

/**
 * Email service.
 */
class EmailService {
  /**
   * This function sends a reset password message to the informed email address.
   * @param {string} destination The email address that will
   * receive the reset password message.
   * @param {string} resetToken The hexadecimal string representing
   * the reset password token.
   * @param {Response} res The response object.
   */
  async sendEmail(destination, resetToken, res) {
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
          res.status(OK)
              .json({message: Messages.RESET_PASSWORD_MESSAGE_SENT});
        })
        .catch((error) => {
          res.status(INTERNAL_SERVER_ERROR).json({
            message: Messages.ERROR_SEND_RESET_PASSWORD_MESSAGE,
            details: error,
          });
        });
  }
}

module.exports = EmailService;
