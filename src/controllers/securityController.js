/* eslint-disable max-len */
/* eslint-disable camelcase */
const logger = require('../loggerUtil/logger');
const Messages = require('../utils/messages');
const database = require('../db/dbconfig.js');
const jwt = require('jsonwebtoken');
const SecurityUtils = require('../utils/securityUtils');
const CryptoUtil = require('../utils/cryptoUtil');
const SystemConfigurationController = require('./systemConfigurationController');
const HealthInfoController = require('./healthInfoController');

const DEFAULT_PROFILE_PICTURE = '../includes/imgs/default-profile-picture.jpg';
/**
 * SecurityController.
 *
 * Contains methods to deal with security.
 */
class SecurityController {
  static TOKEN_EXPIRING_TIME = '30m';

  /**
   * Registers a new user.
   *
   * @async
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Promise<void>} - A promise that resolves to void.
   * @throws {Error} - If an error occurs during the process.
   */
  static registerNewUser = async (req, res) => {
    logger.info(`Executing SecurityController.registerNewUser`);
    let {name, email, picture, password, cod_role} = req.body;

    if (!name || !email || !password || !cod_role) {
      return res.status(400).json({message: Messages.INCOMPLETE_DATA_PROVIDED});
    }

    try {
      const emailAlreadyUsed = await SecurityController.isEmailAlreadyUsed(email);

      if (emailAlreadyUsed) {
        res.status(400).json({message: Messages.EMAIL_ALREADY_USED});
        return;
      } else {
        const id = CryptoUtil.createRandomToken();
        const hashedPassword = SecurityUtils.generateHashValue(password);

        if (!picture) {
          picture = DEFAULT_PROFILE_PICTURE;
        }

        await database('users')
            .insert(
                {
                  id,
                  name,
                  email,
                  picture,
                  password: hashedPassword,
                  cod_role,
                },
                ['id'],
            );
        logger.info('New user saved.');

        // Save default system configuration for the new user.
        SystemConfigurationController.saveDefaultSystemConfiguration(id);
        HealthInfoController.saveNewHealthInfo({userId: id});
        res.status(201).json({message: Messages.NEW_USER_CREATED});
      }
    } catch (error) {
      logger.error(`Error SecurityController.registerNewUser-${error.message}`);
      res.status(500).json({
        message: Messages.ERROR,
        details: error.message,
      });
    }
  };

  /**
   * @param {string} email
   * @return {boolean} A boolean indicating whether the email
   * is already used.
   */
  static isEmailAlreadyUsed = async (email) => {
    const registers = await database('users')
        .where('users.email', email)
        .select('users.id')
        .limit(1);
    return (registers.length > 0);
  };

  /**
   * Do the login of a user.
   *
   * @async
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Promise<void>} - A promise that resolves to void.
   * @throws {Error} - If an error occurs during the process.
   */
  static doLogin = async (req, res) => {
    logger.info(`Executing SecurityController.doLogin`);
    const {email, password} = req.body;

    if (!email || !password) {
      return res.status(400).json({message: Messages.INCOMPLETE_DATA_PROVIDED});
    }

    try {
      const users = await database
          .select('*')
          .from('users')
          .where({email});

      if (users.length) {
        const user = users[0];
        const isValidPassword = SecurityUtils
            .comparePassword(password, user.password);

        if (isValidPassword) {
          const tokenJWT = SecurityController.createTokenJWT(user);
          res.set('Authorization', tokenJWT);
          res.status(200).json({
            user_id: user.id,
            accessToken: tokenJWT,
          });
        } else {
          res.status(401).json({message: Messages.WRONG_CREDENTIALS});
        }
      } else {
        res.status(401).json({message: Messages.WRONG_CREDENTIALS});
      }
    } catch (error) {
      logger.error(`Error SecurityController.doLogin - ${error.message}`);
      res.status(500).json({
        message: Messages.ERROR,
        details: error.message,
      });
    }
  };

  /**
   * Validates a user's password.
   *
   * @async
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Promise<void>} - A promise that resolves to void.
   * @throws {Error} - If an error occurs during the process.
   */
  static passwordValidation = async (req, res) => {
    logger.info(`Executing SecurityController.passwordValidation`);
    const {userId, password} = req.body;

    if (!userId || !password) {
      return res.status(400).json({message: Messages.INCOMPLETE_DATA_PROVIDED});
    }

    try {
      const users = await database
          .select('password')
          .from('users')
          .where({id: userId});

      if (users.length) {
        const user = users[0];
        const isValidPassword = SecurityUtils
            .comparePassword(password, user.password);

        res.status(200).json({result: isValidPassword});
      } else {
        res.status(404).json({message: Messages.NOTHING_FOUND});
      }
    } catch (error) {
      logger.error(`Error SecurityController.passwordValidation-${error.message}`);
      res.status(500).json({
        message: Messages.ERROR,
        details: error.message,
      });
    }
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
