const Messages = require('../utils/messages');
const jwt = require('jsonwebtoken');
const database = require('../db/dbconfig.js');
const bcrypt = require('bcryptjs');
/**
 * SecurityUtils.
 */
class SecurityUtils {
  /**
   * It checks whether the web token is valid.
   * @param {XMLHttpRequest} req request object.
   * @param {XMLHttpRequest} res response object.
   * @param {Function} next The next function to be executed.
   * @return {void}
   */
  static checkToken = (req, res, next) => {
    const authToken = req.headers['authorization'];
    if (!authToken) {
      res.status(401).json({message: Messages.TOKEN_REQUIRED});
      return;
    } else {
      const token = authToken.split(' ')[1];
      req.token = token;
    }

    jwt.verify(req.token, process.env.SECRET_KEY, (err, decodeToken) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          res.status(401)
              .json({message: Messages.TOKEN_EXPIRED,
                expiredIn: err.expiredAt});
          return;
        }
        res.status(401).json({message: Messages.REFUSED_ACCESS});
        return;
      }
      req.userId = decodeToken.id;
      next();
    });
  };

  // CHECK USER ROLE.
  static isAdmin = (req, res, next) => {
    database
        .select('*').from('users').where({id: req.userId})
        .then((users) => {
          if (users.length) {
            const user = users[0];
            const role = user.role_id;

            if (role === 1) {
              next();
              return;
            } else {
              res.status(403).json({message: Messages.ROLE_ADMIN_REQUIRED});
              return;
            }
          }
        })
        .catch((err) => {
          res.status(500).json({
            message: Messages.ERROR_CHECKING_USER_ROLE,
            error: err.message});
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
