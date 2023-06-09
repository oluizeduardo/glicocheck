/* eslint-disable max-len */
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

      if (!userId || !diabetesType || !monthDiagnosis || !bloodType) {
        res.status(400).json({message: Messages.INCOMPLETE_DATA_PROVIDED});
        return;
      }

      const healthInfo = {
        userId,
        diabetesType,
        bloodType,
        monthDiagnosis,
      };

      const register = await HealthInfoController.saveNewHealthInfo(healthInfo);

      if (register) {
        return res.status(201).json(register);
      } else {
        logger.error(`Error HealthInfoController.addNew`);
        return res.status(500).json(Messages.ERROR);
      }
    } catch (error) {
      logger.error(`Error HealthInfoController.addNew - ${error.message}`);
      res.status(500).json({
        message: Messages.ERROR,
      });
    }
  };

  /**
   * Save a new Health info object in the database.
   * @param {object} healthInfo
   * @return {Array} A list of registered objects.
   */
  static saveNewHealthInfo = async (healthInfo) => {
    const records = await database('health_info')
        .insert({
          user_id: healthInfo.userId,
          diabetes_type: healthInfo.diabetesType,
          blood_type: healthInfo.bloodType,
          month_diagnosis: healthInfo.monthDiagnosis,
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

    if (records.length > 0) {
      logger.info('Saved user\'s health info.');
      return records[0];
    } else {
      logger.error(`Error HealthInfoController.saveNewHealthInfo`);
    }
    return;
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
      logger.error(`Error HealthInfoController.getAll - ${error.message}`);
      res.status(500).json({
        message: Messages.ERROR,
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
          .join('users', 'health_info.user_id', 'users.id')
          .select(
              'health_info.id',
              'health_info.diabetes_type',
              'health_info.blood_type',
              'health_info.month_diagnosis',
              'health_info.created_at',
              'health_info.updated_at',
              'users.name as user_name',
              'users.email as user_email',
              'users.birthdate as user_birthdate',
              'users.phone as user_phone',
              'users.gender_id as user_gender_id',
              'users.weight as user_weight',
              'users.height as user_height',
              'users.role_id as user_role_id',
              'users.picture as user_picture',
              'users.created_at as user_created_at',
              'users.updated_at as user_updated_at',
          );

      if (registers.length > 0) {
        const response = HealthInfoController.adaptResponseBody(registers[0]);
        res.status(200).json(response);
      } else {
        res.status(404).json({message: Messages.NOTHING_FOUND});
      }
    } catch (error) {
      logger.error(`Error HealthInfoController.getByUserId - ${error.message}`);
      res.status(500).json({
        message: Messages.ERROR,
      });
    }
  };

  /**
   * Adapts the response body to contain the user's information
   * as a nested object.
   * @param {object} obj
   * @return {object} A health infomation object with the user's data
   * in an internal nested object.
   */
  static adaptResponseBody = (obj) => {
    const response = {
      ...obj,
      user: {
        name: obj.user_name,
        email: obj.user_email,
        birthdate: obj.user_birthdate,
        phone: obj.user_phone,
        gender_id: obj.user_gender_id,
        weight: obj.user_weight,
        height: obj.user_height,
        role_id: obj.user_role_id,
        picture: obj.user_picture,
        created_at: obj.user_created_at,
        updated_at: obj.user_updated_at,
      },
    };

    // Remove the duplicated field from the top-level object.
    delete response.user_name;
    delete response.user_email;
    delete response.user_birthdate;
    delete response.user_phone;
    delete response.user_gender_id;
    delete response.user_weight;
    delete response.user_height;
    delete response.user_role_id;
    delete response.user_picture;
    delete response.user_created_at;
    delete response.user_updated_at;

    return response;
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

    const healthInfo = {
      diabetes_type: req.body.diabetesType,
      month_diagnosis: req.body.monthDiagnosis,
      blood_type: req.body.bloodType,
      updated_at: DateTimeUtil.getCurrentDateTime(),
    };

    try {
      const numAffectedRegisters = await database('health_info')
          .where('user_id', id)
          .update(healthInfo);

      if (numAffectedRegisters === 0) {
        res.status(404).json({message: Messages.NOTHING_FOUND});
      } else {
        healthInfo.user_id = id;
        res.status(200).json(healthInfo);
      }
    } catch (error) {
      // eslint-disable-next-line max-len
      logger.error(`Error HealthInfoController.updateByUserId - ${error.message}`);
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
      logger.error(`Error HealthInfoController.deleteUserById - ${error.message}`);
      res.status(500).json({
        message: Messages.ERROR,
      });
    }
  };
}

module.exports = HealthInfoController;
