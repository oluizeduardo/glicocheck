const nodemailer = require('nodemailer');
const ResetPasswordHTMLMessage = require('../utils/resetPasswordHTMLMessage');

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
  sendEmail(destination, resetToken, res) {
    const resource = 'EmailService.sendEmail';

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
          from: `"Glicocheck" <${user}>`,
          to: destination,
          subject: 'Reset password',
          html: ResetPasswordHTMLMessage.createHTMLMessage(resetToken),
        }).then(() => {
          console.error(`${resource} - Email sent to ${destination}`);
        })
        .catch((error) => {
          console.error(`${resource} - Error: ${error}`);
        });
  }
}

module.exports = EmailService;
