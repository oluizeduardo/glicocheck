const logger = require('../loggerUtil/logger');
const Messages = require('../utils/messages');
const database = require('../db/dbconfig.js');
const DateTimeUtil = require('../utils/dateTimeUtil');
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
    const {
      userId,
      glucoseUnityId,
      limitHypo,
      limitHyper,
      timeBreakfastPre,
      timeBreakfastPos,
      timeLunchPre,
      timeLunchPos,
      timeDinnerPre,
      timeDinnerPos,
      timeSleep,
    } = req.body;

    // Validate input data
    if (
      !userId ||
      !glucoseUnityId ||
      !limitHypo ||
      !limitHyper ||
      !timeBreakfastPre ||
      !timeBreakfastPos ||
      !timeLunchPre ||
      !timeLunchPos ||
      !timeDinnerPre ||
      !timeDinnerPos ||
      !timeSleep
    ) {
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
      return res.status(201).json({message: successMessage});
    } catch (error) {
      // eslint-disable-next-line max-len
      logger.error('Error SystemConfigurationController.addSystemConfiguration');
      return res.status(500).json({message: Messages.ERROR});
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
    logger.info('Saved default system configuration.');
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
          .select(
              'sysconfig.id',
              'sysconfig.user_id',
              'sysconfig.glucose_unity_id',
              'sysconfig.limit_hypo',
              'sysconfig.limit_hyper',
              'sysconfig.time_bf_pre',
              'sysconfig.time_bf_pos',
              'sysconfig.time_lunch_pre',
              'sysconfig.time_lunch_pos',
              'sysconfig.time_dinner_pre',
              'sysconfig.time_dinner_pos',
              'sysconfig.time_sleep',
              'sysconfig.created_at',
              'sysconfig.updated_at',
          );

      if (configurations.length > 0) {
        return res.status(200).json(configurations);
      }

      return res.status(404).json({message: Messages.NOTHING_FOUND});
    } catch (error) {
      // eslint-disable-next-line max-len
      logger.error('Error SystemConfigurationController.getAllSystemConfiguration');
      return res.status(500).json({message: Messages.ERROR});
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
  static getByUserId = async (req, res) => {
    const {userId} = req.params;
    try {
      const configurations = await database('user_system_config as sysconfig')
          .where('user_id', userId)
          .select(
              'sysconfig.id',
              'sysconfig.glucose_unity_id',
              'sysconfig.limit_hypo',
              'sysconfig.limit_hyper',
              'sysconfig.time_bf_pre',
              'sysconfig.time_bf_pos',
              'sysconfig.time_lunch_pre',
              'sysconfig.time_lunch_pos',
              'sysconfig.time_dinner_pre',
              'sysconfig.time_dinner_pos',
              'sysconfig.time_sleep',
              'sysconfig.created_at',
              'sysconfig.updated_at',
          );

      if (configurations.length > 0) {
        return res.status(200).json(configurations[0]);
      }

      return res.status(404).json({message: Messages.NOTHING_FOUND});
    } catch (error) {
      logger.error('Error SystemConfigurationController.getByUserId');
      return res.status(500).json({message: Messages.ERROR});
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
  static updateByUserId = async (req, res) => {
    const {userId} = req.params;

    const updatedConfiguration = {
      glucose_unity_id: req.body.glucoseUnityId,
      limit_hypo: req.body.limitHypo,
      limit_hyper: req.body.limitHyper,
      time_bf_pre: req.body.timeBreakfastPre,
      time_bf_pos: req.body.timeBreakfastPos,
      time_lunch_pre: req.body.timeLunchPre,
      time_lunch_pos: req.body.timeLunchPos,
      time_dinner_pre: req.body.timeDinnerPre,
      time_dinner_pos: req.body.timeDinnerPos,
      time_sleep: req.body.timeSleep,
      updated_at: DateTimeUtil.getCurrentDateTime(),
    };

    try {
      const numAffectedRegisters = await database('user_system_config')
          .where('user_id', userId)
          .update(updatedConfiguration);

      if (numAffectedRegisters === 0) {
        return res.status(404).json({message: Messages.NOTHING_FOUND});
      }

      return res.status(201).json(updatedConfiguration);
    } catch (error) {
      logger.error('Error SystemConfigurationController.updateByUserId');
      return res.status(500).json({
        message: Messages.ERROR,
        details: error.message,
      });
    }
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
  static deleteByUserId = async (req, res) => {
    logger.info('Deleting system configuration by user id.');
    const {userId} = req.params;
    try {
      const numAffectedRegisters = await database('user_system_config')
          .where('user_id', userId)
          .del();

      if (numAffectedRegisters === 0) {
        return res.status(404).json({message: Messages.NOTHING_FOUND});
      }

      return res
          .status(200)
          .json({message: Messages.SYSTEM_CONFIGURATION_DELETED});
    } catch (error) {
      logger.error('Error SystemConfigurationController.deleteByUserId');
      return res.status(500).json({
        message: Messages.ERROR,
        details: error.message,
      });
    }
  };
}

module.exports = SystemConfigurationController;
