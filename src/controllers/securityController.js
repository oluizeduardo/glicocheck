const Messages = require('../utils/messages');
const database = require('../db/dbconfig.js');
const jwt = require('jsonwebtoken');
const SecurityUtils = require('../utils/securityUtils');
const CryptoUtil = require('../utils/cryptoUtil');

/**
 * SecurityController.
 *
 * Contains methods to deal with security.
 */
class SecurityController {
  static TOKEN_EXPIRING_TIME = '30m';

  // NEW USER
  static registerNewUser = async (req, res) => {
    // Checks whether the email is already used.
    await database('users')
        .where('users.email', req.body.email)
        .select('users.id')
        .limit(1)
        .then((users) => {
          if (users.length > 0) {
            // Return message email already used.
            res.status(400).json({message: Messages.EMAIL_ALREADY_USED});
            return;
          } else {
            // Register a new user.
            try {
              database('users')
                  .insert(
                      {
                        id: CryptoUtil.createRandomToken(),
                        name: req.body.name,
                        email: req.body.email,
                        picture: req.body.picture,
                        password: SecurityUtils.generateHashValue(req.body.password),
                        role_id: req.body.role_id,
                      },
                      ['id'],
                  )
                  .then(() => {
                    res.status(201).json({message: Messages.NEW_USER_CREATED});
                  });
            } catch (err) {
              return res.status(500).json({
                message: Messages.ERROR_CREATE_USER,
                error: err.message,
              });
            }
          }
        });
  };

  // LOGIN
  static doLogin = async (req, res) => {
    await database
        .select('*')
        .from('users')
        .where({email: req.body.email})
        .then((users) => {
          if (users.length) {
            const user = users[0];
            const isValidPassword = SecurityUtils.comparePassword(
                req.body.password,
                user.password,
            );

            if (isValidPassword) {
              const tokenJWT = SecurityController.createTokenJWT(user);
              res.set('Authorization', tokenJWT);
              res.status(201).json({
                user_id: user.id,
                accessToken: tokenJWT,
              });
              return;
            }
          }
          res.status(403).json({message: Messages.WRONG_CREDENTIALS});
        })
        .catch((err) => {
          res.status(500).json({
            message: Messages.ERROR_CHECKING_CREDENTIALS,
            error: err.message,
          });
        });
  };

  // PASSWORD VALIDATION
  static passwordValidation = async (req, res) => {
    await database
        .select('password')
        .from('users')
        .where({id: req.body.userId})
        .then((users) => {
          if (users.length) {
            const user = users[0];
            const isValidPassword = SecurityUtils.comparePassword(
                req.body.password,
                user.password,
            );

            if (isValidPassword) {
              res.status(200).json({result: true});
              return;
            } else {
              res.status(200).json({result: false});
              return;
            }
          }
          res.status(404).json({message: Messages.NOTHING_FOUND});
        })
        .catch((err) => {
          res.status(500).json({
            message: Messages.ERROR_CHECKING_CREDENTIALS,
            error: err.message,
          });
        });
  };

  /**
   * Create a new JWT token with user details embeded.
   * @param {*} user The user whose details will be embeded in the JWT token.
   * @return {string} A new JWT token.
   */
  static createTokenJWT(user) {
    return SecurityController.signToken(user.id);
  }

  /**
   * Returns a signed token.
   * @param {number} id The user id to be embeded in the JWT token.
   * @return {string} JWT signed token.
   */
  static signToken(id) {
    const payload = {
      id: id,
    };
    const expires = {
      expiresIn: SecurityController.TOKEN_EXPIRING_TIME,
    };
    const secretKey = process.env.SECRET_KEY;
    const token = jwt.sign(payload, secretKey, expires);
    return token;
  }
}

module.exports = SecurityController;
