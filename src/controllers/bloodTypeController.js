const Messages = require('../utils/messages');
const database = require('../db/dbconfig.js');
const DateTimeUtil = require('../utils/dateTimeUtil');
/**
 * BloodTypeController.
 */
class BloodTypeController {
  /**
   * Retrieves all blood types from the database.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Promise<void>} - A promise that resolves to void.
   * @throws {Error} - If an error occurs during the process.
   */
  static getAllTypes = async (req, res) => {
    try {
      const types = await database('blood_type')
          .select(
              'blood_type.id',
              'blood_type.description',
              'blood_type.created_at',
              'blood_type.updated_at',
          );

      if (types.length > 0) {
        res.status(200).json(types);
      } else {
        res.status(404).json({message: Messages.NOTHING_FOUND});
      }
    } catch (error) {
      res.status(500).json({message: Messages.ERROR});
    }
  };

  /**
   * Creates a new blood type in the database.
   *
   * @async
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Promise<void>} - A promise that resolves to void.
   * @throws {Error} - If an error occurs during the process.
   */
  static createNewType = async (req, res) => {
    try {
      const type = await database('blood_type')
          .insert({
            description: req.body.description,
          })
          .returning(['id', 'description', 'created_at', 'updated_at']);

      res.status(201).json(type[0]);
    } catch (error) {
      res.status(500).json({message: Messages.ERROR});
    }
  };

  /**
   * Retrieves a blood type by its ID from the database.
   *
   * @async
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Promise<void>} - A promise that resolves to void.
   * @throws {Error} - If an error occurs during the process.
   */
  static getTypeById = async (req, res) => {
    try {
      const bloodTypeId = Number.parseInt(req.params.id);

      if (isNaN(bloodTypeId)) {
        return res.status(404).json({message: Messages.NOTHING_FOUND});
      }

      const types = await database('blood_type')
          .where('blood_type.id', bloodTypeId)
          .select('blood_type.id', 'blood_type.description',
              'blood_type.created_at', 'blood_type.updated_at');

      if (types.length > 0) {
        res.status(200).json(types[0]);
      } else {
        res.status(404).json({message: Messages.NOTHING_FOUND});
      }
    } catch (error) {
      res.status(500).json({message: Messages.ERROR});
    }
  };

  /**
   * Updates a blood type by its ID in the database.
   *
   * @async
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Promise<void>} - A promise that resolves to void.
   * @throws {Error} - If an error occurs during the process.
   */
  static updateTypeById = async (req, res) => {
    try {
      const bloodTypeId = Number.parseInt(req.params.id);

      if (isNaN(bloodTypeId)) {
        return res.status(404).json({message: Messages.NOTHING_FOUND});
      }

      const newType = {
        id: bloodTypeId,
        description: req.body.description,
        updated_at: DateTimeUtil.getCurrentDateTime(),
      };

      const numAffectedRegisters = await database('blood_type')
          .where('id', bloodTypeId)
          .update(newType);

      if (numAffectedRegisters === 0) {
        res.status(404).json({message: Messages.NOTHING_FOUND});
      } else {
        res.status(200).json(newType);
      }
    } catch (error) {
      res.status(500).json({
        message: Messages.ERROR,
        details: error.message,
      });
    }
  };

  /**
   * Deletes a blood type by its ID from the database.
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

      const types = await database('blood_type')
          .where('blood_type.id', bloodTypeId)
          .select('blood_type.id');

      if (types.length > 0) {
        const type = types[0];
        await database('blood_type')
            .where('id', type.id)
            .del();
        res.status(200).json({message: Messages.BLOOD_TYPE_DELETED});
      } else {
        res.status(404).json({message: Messages.NOTHING_FOUND});
      }
    } catch (error) {
      res.status(500).json({
        message: Messages.ERROR,
        details: error.message,
      });
    }
  };
}

module.exports = BloodTypeController;
