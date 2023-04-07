const Messages = require('../utils/messages');
const database = require('../db/dbconfig.js');
const DateTimeUtil = require('../utils/dateTimeUtil');
const WebToken = require('../utils/webToken');
/**
 * GlucoseController.
 *
 * Contains methods to deal with the glucose readings.
 */
class GlucoseController {
  // GET ALL GLUCOSE RECORDS.
  static getAllGlucoseRecords = async function(req, res) {
    await database('glucose')
        .join('users', 'users.id', 'glucose.user_id')
        .join('marker_meal', 'marker_meal.id', 'glucose.markermeal_id')
        .join('measurement_unity', 'measurement_unity.id', 'glucose.unity_id')
        .select(
            'glucose.id',
            'users.id as userId',
            'users.name as user',
            'glucose.glucose',
            'measurement_unity.description as unity',
            'glucose.date',
            'glucose.hour',
            'marker_meal.description as markerMeal',
        )
        .orderBy([
          {column: 'glucose.date', order: 'asc'},
          {column: 'glucose.hour', order: 'asc'},
        ])
        .then((glucoses) => {
          if (glucoses.length) {
            res.status(200).json(glucoses);
          } else {
            res.status(404).json({message: Messages.NOTHING_FOUND});
          }
        });
  };

  // GET GLUCOSE READINGS BY USER ID.
  static getGlucoseReadingsByUserId = async function(req, res) {
    const token = req.headers['authorization'];
    const userId = WebToken.getUserIdFromWebToken(token);

    await database('glucose')
        .where('glucose.user_id', userId)
        .join('users', 'users.id', 'glucose.user_id')
        .join('marker_meal', 'marker_meal.id', 'glucose.markermeal_id')
        .join('measurement_unity', 'measurement_unity.id', 'glucose.unity_id')
        .select(
            'glucose.id',
            'users.id as userId',
            'users.name as user',
            'glucose.glucose',
            'measurement_unity.description as unity',
            'glucose.date',
            'glucose.hour',
            'marker_meal.description as markerMeal',
        )
        .orderBy([
          {column: 'glucose.date', order: 'asc'},
          {column: 'glucose.hour', order: 'asc'},
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
    const id = Number.parseInt(req.params.id);
    await database('glucose')
        .where('glucose.id', id)
        .join('users', 'users.id', 'glucose.user_id')
        .join('marker_meal', 'marker_meal.id', 'glucose.markermeal_id')
        .join('measurement_unity', 'measurement_unity.id', 'glucose.unity_id')
        .select(
            'glucose.id',
            'users.id as userId',
            'users.name as userName',
            'glucose.glucose',
            'measurement_unity.description as unity',
            'glucose.date',
            'glucose.hour',
            'marker_meal.description as markerMeal',
        )
        .then((glucoses) => {
          if (glucoses.length) {
            res.status(200).json(glucoses);
          } else {
            res.status(404).json({message: Messages.NOTHING_FOUND});
          }
        });
  };

  // GET GLUCOSE READINGS BY MARKER MEAL ID
  static getGlucoseReadingsByMarkerMealId = async (req, res) => {
    const markermealid = Number.parseInt(req.params.markermealid);
    await database('glucose')
        .where('glucose.markermeal_id', markermealid)
        .join('users', 'users.id', 'glucose.user_id')
        .join('marker_meal', 'marker_meal.id', 'glucose.markermeal_id')
        .join('measurement_unity', 'measurement_unity.id', 'glucose.unity_id')
        .select(
            'glucose.id',
            'users.id as userId',
            'users.name as userName',
            'glucose.glucose',
            'measurement_unity.description as unity',
            'glucose.date',
            'glucose.hour',
            'marker_meal.description as markerMeal',
        )
        .orderBy([
          {column: 'glucose.date', order: 'asc'},
          {column: 'glucose.hour', order: 'asc'},
        ])
        .then((glucoses) => {
          if (glucoses.length) {
            res.status(200).json(glucoses);
          } else {
            res.status(404).json({message: Messages.NOTHING_FOUND});
          }
        });
  };

  // CREATE NEW GLUCOSE READING
  static createNewGlucoseReading = async (req, res) => {
    await database('glucose')
        .insert(
            {
              user_id: req.body.userId,
              glucose: req.body.glucose,
              unity_id: req.body.unityId,
              date: req.body.date,
              hour: req.body.hour,
              markermeal_id: req.body.markerMealId,
            },
            [
              'id',
              'user_id',
              'glucose',
              'unity_id',
              'date',
              'hour',
              'markermeal_id',
            ],
        )
        .then((glucoses) => {
          const glucose = glucoses[0];
          res.json({glucose});
        })
        .catch((err) => res.status(500).json({err}));
  };

  // UPDATE GLUCOSE READING BY ID
  static updateGlucoseReadingById = async (req, res) => {
    const id = Number.parseInt(req.params.id);

    const glucose = {
      glucose: req.body.glucose,
      unity_id: req.body.unityId,
      date: req.body.date,
      hour: req.body.hour,
      markermeal_id: req.body.markerMealId,
      updated_at: DateTimeUtil.getCurrentDateTime(),
    };

    try {
      await database('glucose')
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

  // DELETE GLUCOSE READING BY ID
  static deleteGlucoseReadingById = async (req, res) => {
    const id = Number.parseInt(req.params.id);

    if (id > 0) {
      database('glucose')
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

  // DELETE ALL GLUCOSE READINGS OF A SPECIFIC USER.
  static deleteGlucoseReadingsByUserId = async (req, res) => {
    const userId = req.params.userId;

    if (userId) {
      database('glucose')
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
