const logger = require('../loggerUtil/logger');
const Messages = require('../utils/messages');
const database = require('../db/dbconfig.js');
const DateTimeUtil = require('../utils/dateTimeUtil');
/**
 * DiabetesTypeController.
 */
class DiabetesTypeController {
  /**
   * Retrieves all diabetes types from the database.
   *
   * @async
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Promise<void>} - A promise that resolves to void.
   * @throws {Error} - If an error occurs during the process.
   */
  static getAllTypes = async (req, res) => {
    try {
      const types = await database('diabetes_type')
          .select('diabetes_type.id', 'diabetes_type.description',
              'diabetes_type.created_at', 'diabetes_type.updated_at');

      if (types.length > 0) {
        res.status(200).json(types);
      } else {
        res.status(404).json({message: Messages.NOTHING_FOUND});
      }
    } catch (error) {
      logger.error('Error DiabetesTypeController.getAllTypes');
      res.status(500).json({message: Messages.ERROR});
    }
  };

  /**
   * Creates a new diabetes type in the database.
   *
   * @async
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Promise<void>} - A promise that resolves to void.
   * @throws {Error} - If an error occurs during the process.
   */
  static createNewType = async (req, res) => {
    try {
      const newType = {
        description: req.body.description,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const types = await database('diabetes_type')
          .insert(newType, ['id', 'description', 'created_at', 'updated_at']);

      res.status(201).json(types[0]);
    } catch (error) {
      logger.error('Error DiabetesTypeController.createNewType');
      res.status(500).json({message: Messages.ERROR});
    }
  };


  /**
   * Retrieves a diabetes type by its ID from the database.
   *
   * @async
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Promise<void>} - A promise that resolves to void.
   * @throws {Error} - If an error occurs during the process.
   */
  static getTypeById = async (req, res) => {
    try {
      const id = Number.parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(404).json({message: Messages.NOTHING_FOUND});
      }

      const types = await database('diabetes_type')
          .where('diabetes_type.id', id)
          .select('diabetes_type.id', 'diabetes_type.description',
              'diabetes_type.created_at', 'diabetes_type.updated_at');

      if (types.length > 0) {
        res.status(200).json(types[0]);
      } else {
        res.status(404).json({message: Messages.NOTHING_FOUND});
      }
    } catch (error) {
      logger.error('Error DiabetesTypeController.getTypeById');
      res.status(500).json({message: Messages.ERROR});
    }
  };

  /**
   * Updates a diabetes type by its ID in the database.
   *
   * @async
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Promise<void>} - A promise that resolves to void.
   * @throws {Error} - If an error occurs during the process.
   */
  static updateTypeById = async (req, res) => {
    try {
      const id = Number.parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(404).json({message: Messages.NOTHING_FOUND});
      }

      const newType = {
        id: id,
        description: req.body.description,
        updated_at: DateTimeUtil.getCurrentDateTime(),
      };

      const numAffectedRegisters = await database('diabetes_type')
          .where('id', id)
          .update(newType);

      if (numAffectedRegisters === 0) {
        return res.status(404).json({message: Messages.NOTHING_FOUND});
      }

      res.status(201).json(newType);
    } catch (error) {
      logger.error('Error DiabetesTypeController.updateTypeById');
      res.status(500).json({
        message: Messages.ERROR,
        details: error.message,
      });
    }
  };


  /**
   * Deletes a diabetes type by its ID from the database.
   *
   * @async
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Promise<void>} - A promise that resolves to void.
   * @throws {Error} - If an error occurs during the process.
   */
  static deleteTypeById = async (req, res) => {
    try {
      const bloodTypeId = Number.parseInt(req.params.id);
      if (isNaN(bloodTypeId)) {
        return res.status(404).json({message: Messages.NOTHING_FOUND});
      }

      const types = await database('diabetes_type')
          .where('diabetes_type.id', bloodTypeId)
          .select('diabetes_type.id');

      if (types.length > 0) {
        const type = types[0];
        await database('diabetes_type')
            .where('id', type.id)
            .del();
        res.status(200).json({message: Messages.DIABETES_TYPE_DELETED});
      } else {
        res.status(404).json({message: Messages.NOTHING_FOUND});
      }
    } catch (error) {
      logger.error('Error DiabetesTypeController.deleteTypeById');
      res.status(500).json({
        message: Messages.ERROR,
        details: error.message,
      });
    }
  };
}

module.exports = DiabetesTypeController;
