/* eslint-disable max-len */
const logger = require('../loggerUtil/logger');
const Messages = require('../utils/messages');
const database = require('../db/dbconfig.js');

// Column cod_role in the database.
const ROLE_USER_ADMIN = '98805e1e-4dbe-483d-8a78-5f1e7e4f72b3';
const ROLE_USER_REGULAR = '42701b81-1120-4f7f-a0ae-1326e813cfcb';

const HTTP_UNAUTHORIZED = 403;
const HTTP_INTERNAL_SERVER_ERROR = 500;


/**
 * Represents a user role.
 */
class Role {
  /**
   * Retrieves the role code of a user.
   *
   * @async
   * @param {number} userId - The ID of the user.
   * @return {Promise<number>} A Promise that resolves with the role ID of the user.
   * @throws {Error} If the user is not found or an error occurs while checking the user's role.
   */
  static _getRoleCode = async (userId) => {
    try {
      const user = await database
          .select('cod_role')
          .from('users')
          .where({id: userId})
          .first();

      if (user) {
        return user.cod_role;
      } else {
        logger.info(`User not found to recover his role code.`);
        throw new Error(Messages.USER_NOT_FOUND);
      }
    } catch (err) {
      logger.error(`Error executing Role.getRole: ${err.message}`);
      throw new Error(Messages.ERROR_CHECKING_USER_ROLE);
    }
  };

  /**
   * Middleware function to check if the user is an admin.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   * @return {void}
   */
  static isAdminUser = async (req, res, next) => {
    const userId = req.userId;

    try {
      const roleCode = await Role._getRoleCode(userId);

      if (roleCode === ROLE_USER_ADMIN) {
        next();
      } else {
        logger.info(Messages.EXECUTION_NOT_ALLOWED);
        res.status(HTTP_UNAUTHORIZED).json({message: Messages.EXECUTION_NOT_ALLOWED});
      }
    } catch (err) {
      logger.error(`Error executing Role.isAdmin: ${err.message}`);
      res.status(HTTP_INTERNAL_SERVER_ERROR).json({
        message: Messages.ERROR_CHECKING_USER_ROLE,
      });
    }
  };

  /**
   * Middleware function to check if the user is a regular user.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   * @return {void}
   */
  static isRegularUser = async (req, res, next) => {
    const userId = req.userId;

    try {
      const roleId = await Role._getRoleCode(userId);

      if (roleId === ROLE_USER_REGULAR) {
        next();
      } else {
        logger.info(Messages.EXECUTION_NOT_ALLOWED);
        res.status(HTTP_UNAUTHORIZED).json({message: Messages.EXECUTION_NOT_ALLOWED});
      }
    } catch (err) {
      logger.error(`Error executing Role.isRegularUser: ${err.message}`);
      res.status(HTTP_INTERNAL_SERVER_ERROR).json({
        message: Messages.ERROR_CHECKING_USER_ROLE,
      });
    }
  };
}

module.exports = Role;
