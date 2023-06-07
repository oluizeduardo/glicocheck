const logger = require('../loggerUtil/logger');
const Messages = require('../utils/messages');
const database = require('../db/dbconfig.js');
const DateTimeUtil = require('../utils/dateTimeUtil');
/**
 * HealthInfoController.
 */
class HealthInfoController {
  /**
   * Creates a new health info for a specific user.
   *
   * @async
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Promise<void>} - A promise that resolves to void.
   * @throws {Error} - If an error occurs during the process.
   */
  static addNew = async (req, res) => {
    try {
      const {userId, diabetesType, bloodType, monthDiagnosis} = req.body;

      // Validate input data
      if (!userId || !diabetesType || !monthDiagnosis || !bloodType) {
        res.status(400).json({message: Messages.INCOMPLETE_DATA_PROVIDED});
        return;
      }

      const records = await database('health_info')
          .insert({
            user_id: userId,
            diabetes_type: diabetesType,
            blood_type: bloodType,
            month_diagnosis: monthDiagnosis,
            created_at: DateTimeUtil.getCurrentDateTime(),
            updated_at: DateTimeUtil.getCurrentDateTime(),
          }, [
            'id',
            'user_id',
            'diabetes_type',
            'blood_type',
            'month_diagnosis',
            'created_at',
            'updated_at',
          ]);
      res.status(201).json(records[0]);
    } catch (error) {
      logger.error('Error HealthInfoController.addNew');
      res.status(500).json({
        message: Messages.ERROR,
        details: error.message,
      });
    }
  };

  /**
   * Retrieves all health info registers from the database.
   *
   * @async
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Promise<void>} - A promise that resolves to void.
   * @throws {Error} - If an error occurs during the process.
   */
  static getAll = async (req, res) => {
    try {
      const registers = await database('health_info')
          .select(
              'id',
              'user_id',
              'diabetes_type',
              'blood_type',
              'month_diagnosis',
              'created_at',
              'updated_at',
          );

      if (registers.length > 0) {
        res.status(200).json(registers);
      } else {
        res.status(404).json({message: Messages.NOTHING_FOUND});
      }
    } catch (error) {
      logger.error('Error HealthInfoController.getAll');
      res.status(500).json({
        message: Messages.ERROR,
        details: error.message,
      });
    }
  };

  /**
   * Retrieves the health information of an informed user.
   *
   * @async
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Promise<void>} - A promise that resolves to void.
   * @throws {Error} - If an error occurs during the process.
   */
  static getByUserId = async (req, res) => {
    const id = req.params.id;

    try {
      const registers = await database('health_info')
          .where('user_id', id)
          .select(
              'id',
              'user_id',
              'diabetes_type',
              'blood_type',
              'month_diagnosis',
              'created_at',
              'updated_at',
          );

      if (registers.length > 0) {
        res.status(200).json(registers[0]);
      } else {
        res.status(404).json({message: Messages.NOTHING_FOUND});
      }
    } catch (error) {
      logger.error('Error HealthInfoController.getByUserId');
      res.status(500).json({
        message: Messages.ERROR,
        details: error.message,
      });
    }
  };

  /**
   * Updates the health information of an informed user.
   *
   * @async
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Promise<void>} - A promise that resolves to void.
   * @throws {Error} - If an error occurs during the process.
   */
  static updateByUserId = async (req, res) => {
    const id = req.params.id;

    const updatedHealthInfo = {
      diabetes_type: req.body.diabetesType,
      month_diagnosis: req.body.monthDiagnosis,
      blood_type: req.body.bloodType,
      updated_at: DateTimeUtil.getCurrentDateTime(),
    };

    try {
      const numAffectedRegisters = await database('health_info')
          .where('user_id', id)
          .update(updatedHealthInfo);

      if (numAffectedRegisters === 0) {
        res.status(404).json({message: Messages.NOTHING_FOUND});
      } else {
        updatedHealthInfo.user_id = id;
        res.status(201).json(updatedHealthInfo);
      }
    } catch (error) {
      logger.error('Error HealthInfoController.updateByUserId');
      res.status(500).json({
        message: Messages.ERROR,
        details: error.message,
      });
    }
  };

  /**
   * Deletes the health information of an informed user.
   *
   * @async
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Promise<void>} - A promise that resolves to void.
   * @throws {Error} - If an error occurs during the process.
   */
  static deleteByUserId = async (req, res) => {
    const userId = req.params.id;

    try {
      const registers = await database('health_info')
          .where('health_info.user_id', userId)
          .select('health_info.id');

      if (registers.length === 0) {
        // User not found to delete health info.
        res.status(404).json({message: Messages.NOTHING_FOUND});
      } else {
        await database('health_info')
            .where('user_id', userId)
            .del();

        res.status(200).json({message: Messages.HEALTH_INFO_DELETED});
      }
    } catch (error) {
      logger.error('Error HealthInfoController.deleteUserById');
      res.status(500).json({
        message: Messages.ERROR,
        details: error.message,
      });
    }
  };
}

module.exports = HealthInfoController;
