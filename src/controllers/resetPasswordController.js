const logger = require('../loggerUtil/logger');
const Messages = require('../utils/messages');
const database = require('../db/dbconfig.js');
const DateTimeUtil = require('../utils/dateTimeUtil');
const EmailService = require('../service/emailService');
const fs = require('fs');
const SecurityUtils = require('../utils/securityUtils');
const CryptoUtil = require('../utils/cryptoUtil');

const baseFilePath = getBaseFilePath();
const PAGE_RESET_PASSWORD = baseFilePath+'/public/reset-password.html';
const PAGE_ERROR = baseFilePath+'/public/error.html';
const PAGE_RESET_CANCEL = baseFilePath+'/public/reset-cancel.html';
const PAGE_EXPIRED_LINK = baseFilePath+'/public/expired-link.html';

// HTTP status code.
const OK = 200;
const NOT_FOUND = 404;
const GONE = 410;
const INTERNAL_SERVER_ERROR = 500;

/**
 * ResetPasswordController.
 *
 * Contains methods to reset the user password.
 */
class ResetPasswordController {
  /**
   * Handle the user reset password process.
   * @param {Request} req The request object.
   * @param {Response} res The response object.
   */
  static handleResetPassword = async (req, res) => {
    const resetToken = req.params.resetToken;

    await database('password_reset_tokens')
        .where('token', resetToken)
        .select('*')
        .then((results) => {
          if (results.length > 0) {
            const token = results[0];
            // Checks if it's a valid token.
            const isExpired = DateTimeUtil.isPassedOneHour(token.created_at);
            if (isExpired) {
              ResetPasswordController.deleteToken(resetToken);
              res.status(GONE);
              res.sendFile(PAGE_EXPIRED_LINK);
            } else {
              const fileContent = createContentResetPasswordPage(token);
              res.status(OK);
              res.send(fileContent);
            }
          } else {
            res.status(NOT_FOUND);
            res.sendFile(PAGE_EXPIRED_LINK);
          }
        });
  };
  /**
   * Handle the cancelation of the reset password request.
   * Delete the token in the database.
   * @param {Request} req The request object.
   * @param {Response} res The response object.
   */
  static handleCancelResetRequest = async (req, res) => {
    const resetToken = req.params.resetToken;
    await ResetPasswordController.deleteToken(resetToken)
        .then(() => {
          res.status(OK);
          res.sendFile(PAGE_RESET_CANCEL);
          return;
        })
        .catch((err) => {
          // eslint-disable-next-line max-len
          logger.error('Error ResetPasswordController.handleCancelResetRequest');
          res.status(INTERNAL_SERVER_ERROR);
          res.sendFile(PAGE_ERROR);
          return;
        });
  };
  /**
   * After informing a valid email address, this function
   * starts the process to reset the user password.
   * @param {Request} req The request object.
   * @param {Response} res The response object.
   */
  static handleForgotPassword = async (req, res) => {
    const {email} = req.body;
    // It checks whether the email exists or not in the database.
    await database('users')
        .where('email', email)
        .select('id')
        .then((users) => {
          if (users.length > 0) {
            const token = ResetPasswordController.createResetToken(email);
            new EmailService().sendEmail(email, token);
            return res.status(200)
                .json({message: Messages.RESET_PASSWORD_MESSAGE_SENT});
          } else {
            return res.status(NOT_FOUND)
                .json({message: Messages.NOTHING_FOUND});
          }
        });
  };
  /**
   * Handle the process to update the user password.
   * @param {Request} req The request object.
   * @param {Response} res The response object.
   */
  static updateUserPassword = async (req, res) => {
    let resetToken = '';
    let email = '';
    let userId = '';
    const password = req.body.password;

    // Forgot password flow.
    if (req.body.token && req.body.email) {
      resetToken = (req.body.token).replace('\'', '');
      email = req.body.email;
    }

    // Profile>security flow.
    if (req.body.userId) {
      userId = req.body.userId;
    }

    const user = {
      password: SecurityUtils.generateHashValue(password),
      updated_at: DateTimeUtil.getCurrentDateTime(),
    };

    await database('users')
        .where('email', email)
        .orWhere('id', userId)
        .update(user)
        .then((numAffectedRegisters) => {
          if (numAffectedRegisters == 0) {
            res.status(NOT_FOUND).json({message: Messages.NOTHING_FOUND});
          } else {
            // Forgot password flow.
            if (resetToken) {
              ResetPasswordController.deleteToken(resetToken);
            }
            res.status(OK).json({message: Messages.PASSWORD_UPDATED});
          }
        });
  };
  /**
   * Creates a new password reset token.
   * Save the new token in the database and return the token itself.
   * @param {string} email The user email address.
   * @return {string} The reset password token.
   */
  static createResetToken = (email) => {
    const token = CryptoUtil.createRandomToken();
    ResetPasswordController.saveResetToken(token, email);
    return token;
  };
  /**
   * Save in the database the new reset password token.
   * @param {string} token The password reset token.
   * @param {string} email_owner The owner email address.
   */
  // eslint-disable-next-line camelcase
  static saveResetToken = async (token, email_owner) => {
    // eslint-disable-next-line camelcase
    await database('password_reset_tokens').insert({token, email_owner});
  };
  /**
   * Deletes a token in the database.
   * @param {string} token The token to be deleted.
   * @return {Promise} A Promise object.
   */
  static deleteToken = async (token) => {
    return database('password_reset_tokens').where('token', token).del();
  };
}
/**
 * Extracts from the __dirname the base path until src folder.
 * @return {string} A string.
 */
function getBaseFilePath() {
  return __dirname.split('controller')[0];
}
/**
 * Create content for the rest password page.
 * @param {string} token The reset token object recovered from the database.
 * @return {string} A string with the page's content.
 */
function createContentResetPasswordPage(token) {
  const filePath = PAGE_RESET_PASSWORD;
  let fileContent = fs.readFileSync(filePath).toString();
  fileContent = fileContent.replace('#{email}', token.email_owner);
  fileContent = fileContent.replace('<a href="#{url_reset_token}">',
      `<a href="https://glicocheck.onrender.com/api/reset/cancel/${token.token}">`);
  return fileContent;
}

module.exports = ResetPasswordController;
