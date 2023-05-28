const Messages = require('../utils/messages');
const database = require('../db/dbconfig.js');
/**
 * SystemConfigurationController.
 */
class SystemConfigurationController {
  /**
   * Adds into the database a new user's specific system configuration.
   *
   * @async
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Promise<void>} - A promise that resolves to void.
   * @throws {Error} - If an error occurs during the process.
   */
  static addSystemConfiguration = async (req, res) => {
    const {userId, glucoseUnityId, limitHypo, limitHyper, timeBreakfastPre,
      timeBreakfastPos, timeLunchPre, timeLunchPos, timeDinnerPre,
      timeDinnerPos, timeSleep} = req.body;

    // Validate input data
    if (!userId || !glucoseUnityId || !limitHypo || !limitHyper ||
        !timeBreakfastPre || !timeBreakfastPos || !timeLunchPre ||
        !timeLunchPos || !timeDinnerPre || !timeDinnerPos || !timeSleep) {
      res.status(400).json({message: Messages.INCOMPLETE_DATA_PROVIDED});
      return;
    }

    try {
      const newConfiguration = {
        user_id: userId,
        glucose_unity_id: glucoseUnityId,
        limit_hypo: limitHypo,
        limit_hyper: limitHyper,
        time_bf_pre: timeBreakfastPre,
        time_bf_pos: timeBreakfastPos,
        time_lunch_pre: timeLunchPre,
        time_lunch_pos: timeLunchPos,
        time_dinner_pre: timeDinnerPre,
        time_dinner_pos: timeDinnerPos,
        time_sleep: timeSleep,
      };

      await database('user_system_config').insert(newConfiguration, ['id']);

      const successMessage = Messages.NEW_CONFIGURATION_CREATED + userId;
      res.status(201).json({message: successMessage});
    } catch (error) {
      res.status(500).json({message: Messages.ERROR});
    }
  };

  /**
   * Save into the database the default system configuration
   * for the informed user id.
   * @param {string} userId The user that will receive the default
   * system configuration.
   */
  static saveDefaultSystemConfiguration = async (userId) => {
    const defaultSystemConfig = {
      user_id: userId,
      glucose_unity_id: 1,
      limit_hypo: 70,
      limit_hyper: 160,
      time_bf_pre: '06:00',
      time_bf_pos: '08:00',
      time_lunch_pre: '12:00',
      time_lunch_pos: '14:00',
      time_dinner_pre: '19:00',
      time_dinner_pos: '21:00',
      time_sleep: '23:00',
    };
    await database('user_system_config').insert(defaultSystemConfig, ['id']);
    console.log('Saved default system configuration.');
  };

  /**
   * Retrieves all users' configuration from the database.
   *
   * @async
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Promise<void>} - A promise that resolves to void.
   * @throws {Error} - If an error occurs during the process.
   */
  static getAllSystemConfiguration = async (req, res) => {
    try {
      const configurations = await database('user_system_config as sysconfig')
          .select('sysconfig.id', 'sysconfig.user_id', 'sysconfig.glucose_unity_id',
              'sysconfig.limit_hypo', 'sysconfig.limit_hyper', 'sysconfig.time_bf_pre',
              'sysconfig.time_bf_pos', 'sysconfig.time_lunch_pre', 'sysconfig.time_lunch_pos',
              'sysconfig.time_dinner_pre', 'sysconfig.time_dinner_pos', 'sysconfig.time_sleep',
              'sysconfig.created_at', 'sysconfig.updated_at');

      if (configurations.length > 0) {
        res.status(200).json(configurations);
      } else {
        res.status(404).json({message: Messages.NOTHING_FOUND});
      }
    } catch (error) {
      res.status(500).json({message: Messages.ERROR});
    }
  };

  /**
   * Retrieves from the database a specific system
   * configuration by user ID.
   *
   * @async
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Promise<void>} - A promise that resolves to void.
   * @throws {Error} - If an error occurs during the process.
   */
  static getConfigurationByUserId = async (req, res) => {
    const {userId} = req.params;
    try {
      const configurations = await database('user_system_config as sysconfig')
          .where('user_id', userId)
          .select('sysconfig.id', 'sysconfig.glucose_unity_id',
              'sysconfig.limit_hypo', 'sysconfig.limit_hyper', 'sysconfig.time_bf_pre',
              'sysconfig.time_bf_pos', 'sysconfig.time_lunch_pre', 'sysconfig.time_lunch_pos',
              'sysconfig.time_dinner_pre', 'sysconfig.time_dinner_pos', 'sysconfig.time_sleep',
              'sysconfig.created_at', 'sysconfig.updated_at');

      if (configurations.length > 0) {
        res.status(200).json(configurations);
      } else {
        res.status(404).json({message: Messages.NOTHING_FOUND});
      }
    } catch (error) {
      res.status(500).json({message: Messages.ERROR});
    }
  };

  /**
   * Updates a system configuration by user ID.
   *
   * @async
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Promise<void>} - A promise that resolves to void.
   * @throws {Error} - If an error occurs during the process.
   */
  static updateConfigurationByUserId = async (req, res) => {
    const id = req.params.id;
    return null;
  };

  /**
   * Deletes a specific system configuration by user ID.
   *
   * @async
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Promise<void>} - A promise that resolves to void.
   * @throws {Error} - If an error occurs during the process.
   */
  static deleteUserById = async (req, res) => {
    const id = req.params.id;
    return null;
  };
}

module.exports = SystemConfigurationController;
