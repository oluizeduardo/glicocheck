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
  // GET ALL BLOOD GLUCOSE RECORDS.
  static getAllGlucoseRecords = async function(req, res) {
    await database('blood_glucose_diary as bgd')
        .join('users', 'users.id', 'bgd.user_id')
        .join('marker_meal', 'marker_meal.id', 'bgd.markermeal_id')
        .join('measurement_unity', 'measurement_unity.id', 'bgd.glucose_unity_id')
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
        .orderBy([
          {column: 'bgd.dateTime', order: 'asc'},
        ])
        .then((glucoses) => {
          if (glucoses.length > 0) {
            res.status(200).json(glucoses);
          } else {
            res.status(404).json({message: Messages.NOTHING_FOUND});
          }
        });
  };

  // GET GLUCOSE RECORDS BY USER ID.
  static getGlucoseRecordsByUserId = async function(req, res) {
    const token = req.headers['authorization'];
    const userId = WebToken.getUserIdFromWebToken(token);

    await database('blood_glucose_diary as bgd')
        .where('bgd.user_id', userId)
        .join('users', 'users.id', 'bgd.user_id')
        .join('marker_meal', 'marker_meal.id', 'bgd.markermeal_id')
        .join('measurement_unity', 'measurement_unity.id', 'bgd.glucose_unity_id')
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
        .orderBy([
          {column: 'bgd.dateTime', order: 'asc'},
        ])
        .then((glucoses) => {
          if (glucoses.length) {
            res.status(200).json(glucoses);
          } else {
            res.status(404).json({message: Messages.NOTHING_FOUND});
          }
        });
  };

  // GET GLUCOSE BY ID
  static getGlucoseById = async (req, res) => {
    let id = 0;
    try {
      id = Number.parseInt(req.params.id);
    } catch {
      return res.status(404).json({message: Messages.NOTHING_FOUND});
    }

    await database('blood_glucose_diary as bgd')
        .where('bgd.id', id)
        .join('users', 'users.id', 'bgd.user_id')
        .join('marker_meal', 'marker_meal.id', 'bgd.markermeal_id')
        .join('measurement_unity', 'measurement_unity.id', 'bgd.glucose_unity_id')
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
        .then((glucoses) => {
          if (glucoses.length) {
            res.status(200).json(glucoses[0]);
          } else {
            res.status(404).json({message: Messages.NOTHING_FOUND});
          }
        });
  };

  // GET GLUCOSE RECORDS BY MARKER MEAL ID
  static getGlucoseRecordsByMarkerMealId = async (req, res) => {
    let markermealid = 0;
    try {
      markermealid = Number.parseInt(req.params.markermealid);
    } catch {
      return res.status(404).json({message: Messages.NOTHING_FOUND});
    }

    await database('blood_glucose_diary as bgd')
        .where('bgd.markermeal_id', markermealid)
        .join('users', 'users.id', 'bgd.user_id')
        .join('marker_meal', 'marker_meal.id', 'bgd.markermeal_id')
        .join('measurement_unity', 'measurement_unity.id', 'bgd.glucose_unity_id')
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
        .orderBy([
          {column: 'bgd.dateTime', order: 'asc'},
        ])
        .then((glucoses) => {
          if (glucoses.length) {
            res.status(200).json(glucoses[0]);
          } else {
            res.status(404).json({message: Messages.NOTHING_FOUND});
          }
        });
  };

  // CREATE NEW GLUCOSE RECORD
  static createNewGlucoseRecord = async (req, res) => {
    await database('blood_glucose_diary')
        .insert(
            {
              user_id: req.body.userId,
              glucose: req.body.glucose,
              glucose_unity_id: req.body.glucose_unity_id,
              total_carbs: req.body.total_carbs,
              carbs_unity_id: req.body.carbs_unity_id,
              dateTime: req.body.dateTime,
              markermeal_id: req.body.markerMealId,
            },
            [
              'id',
              'user_id',
              'glucose',
              'glucose_unity_id',
              'total_carbs',
              'carbs_unity_id',
              'dateTime',
              'markermeal_id',
              'created_at',
              'updated_at',
            ],
        )
        .then((records) => {
          const glucoseRecord = records[0];
          res.json({glucoseRecord});
        })
        .catch((err) => res.status(500).json({err}));
  };

  // UPDATE GLUCOSE RECORD BY ID
  static updateGlucoseRecordById = async (req, res) => {
    let id = 0;
    try {
      id = Number.parseInt(req.params.id);
    } catch {
      return res.status(404).json({message: Messages.NOTHING_FOUND});
    }

    const glucose = {
      glucose: req.body.glucose,
      glucose_unity_id: req.body.unityId,
      total_carbs: req.body.total_carbs,
      carbs_unity_id: req.body.carbs_unity_id,
      markermeal_id: req.body.markerMealId,
      updated_at: DateTimeUtil.getCurrentDateTime(),
    };

    try {
      await database('blood_glucose_diary')
          .where('id', id)
          .update({glucose})
          .then((numAffectedRegisters) => {
            if (numAffectedRegisters == 0) {
              res.status(404).json({message: Messages.NOTHING_FOUND});
            } else {
              res.status(201).json({glucose});
            }
          });
    } catch (err) {
      return res.status(500).json({
        message: Messages.ERROR_UPDATE_GLUCOSE,
        details: `${err.message}`,
      });
    }
  };

  // DELETE GLUCOSE RECORD BY ID
  static deleteGlucoseRecordById = async (req, res) => {
    let id = 0;
    try {
      id = Number.parseInt(req.params.id);
    } catch {
      return res.status(404).json({message: Messages.NOTHING_FOUND});
    }

    if (id > 0) {
      database('blood_glucose_diary')
          .where('id', id)
          .del()
          .then(res.status(200).json({message: Messages.REGISTER_DELETED}))
          .catch((err) =>
            res
                .status(500)
                .json({
                  message: Messages.ERROR_DELETE_GLUCOSE,
                  error: err.message,
                }),
          );
    } else {
      res.status(404).json({
        message: Messages.NOTHING_FOUND,
      });
    }
  };

  // DELETE ALL GLUCOSE RECORDS OF A SPECIFIC USER.
  static deleteGlucoseRecordsByUserId = async (req, res) => {
    const userId = req.params.userId;

    if (userId) {
      database('blood_glucose_diary')
          .where('user_id', userId)
          .del()
          .then(res.status(200).json({message: Messages.REGISTER_DELETED}))
          .catch((err) =>
            res
                .status(500)
                .json({
                  message: Messages.ERROR_DELETE_GLUCOSE,
                  error: err.message,
                }),
          );
    } else {
      res.status(404).json({
        message: Messages.NOTHING_FOUND,
      });
    }
  };
}

module.exports = GlucoseController;
