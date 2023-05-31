const Messages = require('../utils/messages');
const database = require('../db/dbconfig.js');
const DateTimeUtil = require('../utils/dateTimeUtil');
/**
 * GenderController.
 */
class GenderController {
  /**
   * Retrieves all genders from the database.
   *
   * @async
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Promise<void>} - A promise that resolves to void.
   * @throws {Error} - If an error occurs during the process.
   */
  static getAllGenders = async (req, res) => {
    try {
      const genders = await database('gender')
          .select('gender.id', 'gender.description',
              'gender.created_at', 'gender.updated_at');

      if (genders.length > 0) {
        res.status(200).json(genders);
      } else {
        res.status(404).json({message: Messages.NOTHING_FOUND});
      }
    } catch (error) {
      res.status(500).json({message: Messages.ERROR});
    }
  };

  /**
   * Creates a new gender in the database.
   *
   * @async
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Promise<void>} - A promise that resolves to void.
   * @throws {Error} - If an error occurs during the process.
   */
  static createNewGender = async (req, res) => {
    try {
      const gender = {
        description: req.body.description,
      };

      const createdGender = await database('gender')
          .insert(gender, ['id', 'description', 'created_at', 'updated_at']);

      res.status(201).json(createdGender[0]);
    } catch (error) {
      res.status(500).json({message: Messages.ERROR});
    }
  };


  /**
   * Retrieves a gender by its ID from the database.
   *
   * @async
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Promise<void>} - A promise that resolves to void.
   * @throws {Error} - If an error occurs during the process.
   */
  static getGenderById = async (req, res) => {
    try {
      const id = Number.parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(404).json({message: Messages.NOTHING_FOUND});
      }

      const genders = await database('gender')
          .where('gender.id', id)
          .select('gender.id', 'gender.description',
              'gender.created_at', 'gender.updated_at');

      if (genders.length > 0) {
        res.status(200).json(genders[0]);
      } else {
        res.status(404).json({message: Messages.NOTHING_FOUND});
      }
    } catch (error) {
      res.status(500).json({message: Messages.ERROR});
    }
  };


  /**
   * Updates a gender by its ID in the database.
   *
   * @async
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Promise<void>} - A promise that resolves to void.
   * @throws {Error} - If an error occurs during the process.
   */
  static updateGenderById = async (req, res) => {
    try {
      const id = Number.parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(404).json({message: Messages.NOTHING_FOUND});
      }

      const gender = {
        id: id,
        description: req.body.description,
        updated_at: DateTimeUtil.getCurrentDateTime(),
      };

      const numAffectedRegisters = await database('gender')
          .where('id', id)
          .update(gender);

      if (numAffectedRegisters === 0) {
        res.status(404).json({message: Messages.NOTHING_FOUND});
      } else {
        res.status(200).json(gender);
      }
    } catch (error) {
      res.status(500).json({
        message: Messages.ERROR,
        details: error.message,
      });
    }
  };


  /**
   * Deletes a gender by its ID from the database.
   *
   * @async
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Promise<void>} - A promise that resolves to void.
   * @throws {Error} - If an error occurs during the process.
   */
  static deleteGenderById = async (req, res) => {
    try {
      const id = Number.parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(404).json({message: Messages.NOTHING_FOUND});
      }

      const genders = await database('gender')
          .where('gender.id', id)
          .select('gender.id');

      if (genders.length > 0) {
        const gender = genders[0];
        await database('gender')
            .where('id', gender.id)
            .del();
        res.status(200).json({message: Messages.GENDER_DELETED});
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

module.exports = GenderController;
