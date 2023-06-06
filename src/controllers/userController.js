const logger = require('../loggerUtil/logger');
const Messages = require('../utils/messages');
const database = require('../db/dbconfig.js');
const DateTimeUtil = require('../utils/dateTimeUtil');
/**
 * UserController.
 */
class UserController {
  /**
   * Retrieves all users from the database.
   *
   * @async
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Promise<void>} - A promise that resolves to void.
   * @throws {Error} - If an error occurs during the process.
   */
  static getAllUsers = async (req, res) => {
    try {
      const users = await database('users')
          .join('role', 'users.role_id', 'role.id')
          .select(
              'users.id',
              'users.name',
              'users.email',
              'users.birthdate',
              'users.phone',
              'users.gender_id',
              'users.weight',
              'users.height',
              'users.health_id',
              'role.description as role',
              'users.created_at',
              'users.updated_at',
          );

      if (users.length > 0) {
        res.status(200).json(users);
      } else {
        res.status(404).json({message: Messages.NOTHING_FOUND});
      }
    } catch (error) {
      logger.error('Error UserController.getAllUsers');
      res.status(500).json({
        message: Messages.ERROR,
        details: error.message,
      });
    }
  };

  /**
   * Retrieves a user by their ID from the database.
   *
   * @async
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Promise<void>} - A promise that resolves to void.
   * @throws {Error} - If an error occurs during the process.
   */
  static getUserById = async (req, res) => {
    const id = req.params.id;

    try {
      const users = await database('users')
          .where('users.id', id)
          .join('role', 'users.role_id', 'role.id')
          .select(
              'users.id',
              'users.name',
              'users.email',
              'users.birthdate',
              'users.phone',
              'users.gender_id',
              'users.health_id',
              'users.weight',
              'users.height',
              'users.picture',
              'role.description as role',
              'users.created_at',
              'users.updated_at',
          );

      if (users.length > 0) {
        res.status(200).json(users[0]);
      } else {
        res.status(404).json({message: Messages.NOTHING_FOUND});
      }
    } catch (error) {
      logger.error('Error UserController.getUserById');
      res.status(500).json({
        message: Messages.ERROR,
        details: error.message,
      });
    }
  };

  /**
   * Updates a user by their ID in the database.
   *
   * @async
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Promise<void>} - A promise that resolves to void.
   * @throws {Error} - If an error occurs during the process.
   */
  static updateUserById = async (req, res) => {
    const id = req.params.id;

    const updatedUser = {
      name: req.body.name,
      email: req.body.email,
      birthdate: req.body.birthdate,
      phone: req.body.phone,
      gender_id: req.body.gender_id,
      weight: req.body.weight,
      height: req.body.height,
      picture: req.body.picture,
      role_id: req.body.role_id,
      updated_at: DateTimeUtil.getCurrentDateTime(),
    };

    try {
      const numAffectedRegisters = await database('users')
          .where('id', id)
          .update(updatedUser);

      if (numAffectedRegisters === 0) {
        res.status(404).json({message: Messages.NOTHING_FOUND});
      } else {
        res.status(201).json({user: updatedUser});
      }
    } catch (error) {
      logger.error('Error UserController.updateUserById');
      res.status(500).json({
        message: Messages.ERROR,
        details: error.message,
      });
    }
  };

  /**
   * Deletes a user by their ID from the database.
   *
   * @async
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Promise<void>} - A promise that resolves to void.
   * @throws {Error} - If an error occurs during the process.
   */
  static deleteUserById = async (req, res) => {
    const id = req.params.id;

    try {
      const users = await database('users')
          .where('users.id', id)
          .select('users.id');

      if (users.length === 0) {
        // User not found to delete.
        res.status(404).json({message: Messages.NOTHING_FOUND});
      } else {
        const user = users[0];

        await database('users')
            .where('id', user.id)
            .del();

        res.status(200).json({message: Messages.USER_DELETED});
      }
    } catch (error) {
      logger.error('Error UserController.deleteUserById');
      res.status(500).json({
        message: Messages.ERROR,
        details: error.message,
      });
    }
  };
}

module.exports = UserController;
