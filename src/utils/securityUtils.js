const logger = require('../loggerUtil/logger');
const Messages = require('../utils/messages');
const jwt = require('jsonwebtoken');
const database = require('../db/dbconfig.js');
const bcrypt = require('bcryptjs');

const ROLE_ADMIN = 1;

/**
 * SecurityUtils.
 */
class SecurityUtils {
  /**
   * Middleware function to check the validity of a
   * token and extract the user ID.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   * @return {void}
   */
  static checkToken = (req, res, next) => {
    const authToken = req.headers['authorization'];
    if (!authToken) {
      return res.status(401).json({message: Messages.TOKEN_REQUIRED});
    }

    const [, token] = authToken.split(' ');
    req.token = token;

    try {
      const decodeToken = jwt.verify(req.token, process.env.SECRET_KEY);
      req.userId = decodeToken.id;
      return next();
    } catch (err) {
      logger.error(`Error cheking JWT token - ${err.name}`);
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          message: Messages.TOKEN_EXPIRED,
          expiredIn: err.expiredAt,
        });
      }
      return res.status(401).json({message: Messages.REFUSED_ACCESS});
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
  static isAdmin = (req, res, next) => {
    const userId = req.userId;

    database
        .select('role_id')
        .from('users')
        .where({id: userId})
        .first()
        .then((user) => {
          if (user) {
            if (user.role_id === ROLE_ADMIN) {
              next();
            } else {
              res.status(403).json({message: Messages.ROLE_ADMIN_REQUIRED});
            }
          } else {
            res.status(404).json({message: Messages.USER_NOT_FOUND});
          }
        })
        .catch((err) => {
          logger.error(`Error executing SecurityUtils.isAdmin`);
          res.status(500).json({
            message: Messages.ERROR_CHECKING_USER_ROLE,
            error: err.message,
          });
        });
  };

  /**
   * Compare two passwords in BCrypt format.
   * @param {string} password1 The first password.
   * @param {string} password2 The second password.
   * @return {boolean} true if are the same passwords. Return false otherwise.
   */
  static comparePassword = (password1, password2) => {
    return bcrypt.compareSync(password1, password2);
  };

  /**
   * Generates a hash value for the given string.
   * @param {string} s — String to hash.
   * @return {string} Resulting hash.
   */
  static generateHashValue = (s) => {
    return bcrypt.hashSync(s, 8);
  };
}

module.exports = SecurityUtils;
