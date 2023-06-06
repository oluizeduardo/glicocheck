/* eslint-disable camelcase */
const logger = require('../loggerUtil/logger');
const Messages = require('../utils/messages');
const database = require('../db/dbconfig.js');
const DateTimeUtil = require('../utils/dateTimeUtil');
const WebToken = require('../utils/webToken');

/**
 * GlucoseController.
 *
 * Contains methods to deal with the glucose records on the database.
 */
class GlucoseController {
  /**
   * Retrieves all blood glucose records.
   *
   * @async
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Promise<void>} - A promise that resolves to void.
   * @throws {Error} - If an error occurs during the process.
   */
  static getAllGlucoseRecords = async (req, res) => {
    try {
      const glucoses = await database('blood_glucose_diary as bgd')
          .join('users', 'users.id', 'bgd.user_id')
          .join('marker_meal', 'marker_meal.id', 'bgd.markermeal_id')
          .join('measurement_unity', 'measurement_unity.id',
              'bgd.glucose_unity_id')
          .select(
              'bgd.id',
              'users.id as userId',
              'users.name as user',
              'bgd.glucose',
              'measurement_unity.description as glucoseUnity',
              'bgd.total_carbs as totalCarbs',
              'bgd.dateTime',
              'marker_meal.description as markerMeal',
              'bgd.created_at',
              'bgd.updated_at',
          )
          .orderBy('bgd.dateTime', 'asc');

      if (glucoses.length > 0) {
        res.status(200).json(glucoses);
      } else {
        res.status(404).json({message: Messages.NOTHING_FOUND});
      }
    } catch (error) {
      logger.error('Error GlucoseController.getAllGlucoseRecords');
      res.status(500).json({
        message: Messages.ERROR,
        details: error.message,
      });
    }
  };


  /**
   * Retrieves glucose records by user ID.
   *
   * @async
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Promise<void>} - A promise that resolves to void.
   * @throws {Error} - If an error occurs during the process.
   */
  static getGlucoseRecordsByUserId = async (req, res) => {
    try {
      const token = req.headers['authorization'];
      const userId = WebToken.getUserIdFromWebToken(token);

      const glucoses = await database('blood_glucose_diary as bgd')
          .where('bgd.user_id', userId)
          .join('users', 'users.id', 'bgd.user_id')
          .join('marker_meal', 'marker_meal.id', 'bgd.markermeal_id')
          .join('measurement_unity', 'measurement_unity.id',
              'bgd.glucose_unity_id')
          .select(
              'bgd.id',
              'users.id as userId',
              'users.name as user',
              'bgd.glucose',
              'measurement_unity.description as unity',
              'bgd.total_carbs as totalCarbs',
              'bgd.dateTime',
              'marker_meal.description as markerMeal',
              'bgd.created_at as createdAt',
              'bgd.updated_at as updatedAt',
          )
          .orderBy('bgd.dateTime', 'asc');

      if (glucoses.length) {
        res.status(200).json(glucoses);
      } else {
        res.status(404).json({message: Messages.NOTHING_FOUND});
      }
    } catch (error) {
      logger.error('Error GlucoseController.getGlucoseRecordsByUserId');
      res.status(500).json({
        message: Messages.ERROR,
        details: error.message,
      });
    }
  };


  /**
   * Retrieves a glucose record by ID.
   *
   * @async
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Promise<void>} - A promise that resolves to void.
   * @throws {Error} - If an error occurs during the process.
   */
  static getGlucoseById = async (req, res) => {
    try {
      const id = Number.parseInt(req.params.id);

      const glucose = await database('blood_glucose_diary as bgd')
          .where('bgd.id', id)
          .join('users', 'users.id', 'bgd.user_id')
          .join('marker_meal', 'marker_meal.id', 'bgd.markermeal_id')
          .join('measurement_unity', 'measurement_unity.id',
              'bgd.glucose_unity_id')
          .select(
              'bgd.id',
              'users.id as userId',
              'users.name as userName',
              'bgd.glucose',
              'measurement_unity.description as unity',
              'bgd.dateTime',
              'marker_meal.description as markerMeal',
              'bgd.created_at',
              'bgd.updated_at',
          )
          .first();

      if (glucose) {
        res.status(200).json(glucose);
      } else {
        res.status(404).json({message: Messages.NOTHING_FOUND});
      }
    } catch (error) {
      logger.error('Error GlucoseController.getGlucoseById');
      res.status(500).json({
        message: Messages.ERROR,
        details: error.message,
      });
    }
  };


  /**
   * Retrieves glucose records by marker meal ID.
   *
   * @async
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Promise<void>} - A promise that resolves to void.
   * @throws {Error} - If an error occurs during the process.
   */
  static getGlucoseRecordsByMarkerMealId = async (req, res) => {
    try {
      const markerMealId = Number.parseInt(req.params.markermealid);

      const glucoses = await database('blood_glucose_diary as bgd')
          .where('bgd.markermeal_id', markerMealId)
          .join('users', 'users.id', 'bgd.user_id')
          .join('marker_meal', 'marker_meal.id', 'bgd.markermeal_id')
          .join('measurement_unity', 'measurement_unity.id',
              'bgd.glucose_unity_id')
          .select(
              'bgd.id',
              'users.id as userId',
              'users.name as userName',
              'bgd.glucose',
              'measurement_unity.description as unity',
              'bgd.dateTime',
              'marker_meal.description as markerMeal',
              'bgd.created_at',
              'bgd.updated_at',
          )
          .orderBy('bgd.dateTime', 'asc');

      if (glucoses.length > 0) {
        res.status(200).json(glucoses);
      } else {
        res.status(404).json({message: Messages.NOTHING_FOUND});
      }
    } catch (error) {
      logger.error('Error GlucoseController.getGlucoseRecordsByMarkerMealId');
      res.status(500).json({
        message: Messages.ERROR,
        details: error.message,
      });
    }
  };

  /**
   * Creates a new glucose record.
   *
   * @async
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Promise<void>} - A promise that resolves to void.
   * @throws {Error} - If an error occurs during the process.
   */
  static createNewGlucoseRecord = async (req, res) => {
    try {
      const {userId, glucose, glucose_unity_id,
        total_carbs, dateTime, markerMealId} = req.body;

      // Validate input data
      if (!userId || !glucose || !glucose_unity_id ||
        !dateTime || !markerMealId) {
        res.status(400).json({message: Messages.INCOMPLETE_DATA_PROVIDED});
        return;
      }

      const records = await database('blood_glucose_diary')
          .insert({
            user_id: userId,
            glucose,
            glucose_unity_id,
            total_carbs,
            dateTime,
            markermeal_id: markerMealId,
            created_at: DateTimeUtil.getCurrentDateTime(),
            updated_at: DateTimeUtil.getCurrentDateTime(),
          }, [
            'id',
            'user_id',
            'glucose',
            'glucose_unity_id',
            'total_carbs',
            'dateTime',
            'markermeal_id',
            'created_at',
            'updated_at',
          ]);

      res.status(201).json(records[0]);
    } catch (error) {
      logger.error('Error GlucoseController.createNewGlucoseRecord');
      res.status(500).json({
        message: Messages.ERROR,
        details: error.message,
      });
    }
  };

  /**
   * Updates a glucose record by ID.
   *
   * @async
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Promise<void>} - A promise that resolves to void.
   * @throws {Error} - If an error occurs during the process.
   */
  static updateGlucoseRecordById = async (req, res) => {
    try {
      let id = 0;
      try {
        id = Number.parseInt(req.params.id);
      } catch {
        return res.status(404).json({message: Messages.NOTHING_FOUND});
      }

      const {glucose, glucose_unity_id, total_carbs, markermeal_id} = req.body;

      // Validate input data
      if (!glucose || !glucose_unity_id || !total_carbs || !markermeal_id) {
        res.status(400).json({message: Messages.INCOMPLETE_DATA_PROVIDED});
        return;
      }

      const glucoseRecord = {
        glucose,
        glucose_unity_id,
        total_carbs,
        markermeal_id,
        updated_at: DateTimeUtil.getCurrentDateTime(),
      };

      const numAffectedRegisters = await database('blood_glucose_diary')
          .where('id', id)
          .update(glucoseRecord);

      if (numAffectedRegisters === 0) {
        res.status(404).json({message: Messages.NOTHING_FOUND});
      } else {
        glucoseRecord.id = id;
        res.status(200).json(glucoseRecord);
      }
    } catch (error) {
      logger.error('Error GlucoseController.updateGlucoseRecordById');
      res.status(500).json({
        message: Messages.ERROR,
        details: error.message,
      });
    }
  };

  /**
   * Deletes a glucose record by ID.
   *
   * @async
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Promise<void>} - A promise that resolves to void.
   * @throws {Error} - If an error occurs during the process.
   */
  static deleteGlucoseRecordById = async (req, res) => {
    try {
      let id = 0;
      try {
        id = Number.parseInt(req.params.id);
      } catch {
        return res.status(404).json({message: Messages.NOTHING_FOUND});
      }

      if (id > 0) {
        const numAffectedRegisters = await database('blood_glucose_diary')
            .where('id', id)
            .del();

        if (numAffectedRegisters === 0) {
          res.status(404).json({message: Messages.NOTHING_FOUND});
        } else {
          res.status(200).json({message: Messages.REGISTER_DELETED});
        }
      } else {
        res.status(404).json({message: Messages.NOTHING_FOUND});
      }
    } catch (error) {
      logger.error('Error GlucoseController.deleteGlucoseRecordById');
      res.status(500).json({
        message: Messages.ERROR,
        error: error.message,
      });
    }
  };


  /**
   * Deletes all glucose records of a specific user.
   *
   * @async
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Promise<void>} - A promise that resolves to void.
   * @throws {Error} - If an error occurs during the process.
   */
  static deleteGlucoseRecordsByUserId = async (req, res) => {
    try {
      const userId = req.params.userId;

      if (userId) {
        const numAffectedRegisters = await database('blood_glucose_diary')
            .where('user_id', userId)
            .del();

        if (numAffectedRegisters === 0) {
          res.status(404).json({message: Messages.NOTHING_FOUND});
        } else {
          res.status(200).json({message: Messages.REGISTER_DELETED});
        }
      } else {
        res.status(404).json({message: Messages.NOTHING_FOUND});
      }
    } catch (error) {
      logger.error('Error GlucoseController.deleteGlucoseRecordsByUserId');
      res.status(500).json({
        message: Messages.ERROR,
        error: error.message,
      });
    }
  };
}

module.exports = GlucoseController;
