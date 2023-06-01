const Messages = require('../utils/messages');
const database = require('../db/dbconfig.js');
const DateTimeUtil = require('../utils/dateTimeUtil');
/**
 * MarkerMealController.
 *
 * Contains methods to deal with the marker meals.
 */
class MarkerMealController {
  /**
   * Retrieves all marker meals.
   *
   * @async
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Promise<void>} - A promise that resolves to void.
   * @throws {Error} - If an error occurs during the process.
   */
  static getAllMarkerMeals = async (req, res) => {
    try {
      const markers = await database.select('*').from('marker_meal');

      if (markers.length) {
        res.status(200).json(markers);
      } else {
        res.status(200).json({message: Messages.NOTHING_FOUND});
      }
    } catch (error) {
      res.status(500).json({
        message: Messages.ERROR,
        details: error.message,
      });
    }
  };


  /**
   * Retrieves a marker meal by ID.
   *
   * @async
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Promise<void>} - A promise that resolves to void.
   * @throws {Error} - If an error occurs during the process.
   */
  static getMarkerMealById = async (req, res) => {
    const id = Number.parseInt(req.params.id);

    try {
      const markers = await database('marker_meal')
          .where('id', id)
          .select('id', 'description');

      if (markers.length) {
        res.status(200).json(markers[0]);
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

  /**
   * Creates a new marker meal.
   *
   * @async
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Promise<void>} - A promise that resolves to void.
   * @throws {Error} - If an error occurs during the process.
   */
  static createNewMarkerMeal = async (req, res) => {
    try {
      const [marker] = await database('marker_meal')
          .insert({description: req.body.description}, ['id', 'description']);

      res.status(201).json({marker_meal: marker});
    } catch (error) {
      res.status(500).json({
        message: Messages.ERROR,
        details: error.message,
      });
    }
  };


  /**
   * Updates a marker meal by ID.
   *
   * @async
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Promise<void>} - A promise that resolves to void.
   * @throws {Error} - If an error occurs during the process.
   */
  static updateMarkerMealById = async (req, res) => {
    const id = Number.parseInt(req.params.id);

    const updatedMarkerMeal = {
      id: id,
      description: req.body.description,
      updated_at: DateTimeUtil.getCurrentDateTime(),
    };

    try {
      const numAffectedRegisters = await database('marker_meal')
          .where('id', id)
          .update(updatedMarkerMeal);

      if (numAffectedRegisters === 0) {
        res.status(404).json({message: Messages.NOTHING_FOUND});
      } else {
        res.status(200).json(updatedMarkerMeal);
      }
    } catch (error) {
      res.status(500).json({
        message: Messages.ERROR,
        details: error.message,
      });
    }
  };

  /**
   * Deletes a marker meal by ID.
   *
   * @async
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Promise<void>} - A promise that resolves to void.
   * @throws {Error} - If an error occurs during the process.
   */
  static deleteMarkerMealById = async (req, res) => {
    const id = Number.parseInt(req.params.id);

    try {
      const numAffectedRegisters = await database('marker_meal')
          .where('id', id)
          .del();

      if (numAffectedRegisters === 0) {
        res.status(404).json({message: Messages.NOTHING_FOUND});
      } else {
        res.status(200).json({message: Messages.REGISTER_DELETED});
      }
    } catch (error) {
      res.status(500).json({
        message: Messages.ERROR,
        details: error.message,
      });
    }
  };
}

module.exports = MarkerMealController;
