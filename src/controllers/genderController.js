const Messages = require('../utils/messages');
const database = require('../db/dbconfig.js');
const DateTimeUtil = require('../utils/dateTimeUtil');
/**
 * GenderController.
 */
class GenderController {
  // GET ALL GENDERS
  static getAllGenders = async (req, res) => {
    database('gender')
        .select(
            'gender.id',
            'gender.description',
            'gender.created_at',
            'gender.updated_at',
        )
        .then((genders) => {
          if (genders.length) {
            res.status(200).json(genders);
          } else {
            res.status(200).json({message: Messages.NOTHING_FOUND});
          }
        });
  };

  // CREATE NEW GENDER
  static createNewGender = async (req, res) => {
    await database('gender')
        .insert(
            {
              description: req.body.description,
            },
            ['id', 'description', 'created_at', 'updated_at'],
        )
        .then((genders) => {
          const gender = genders[0];
          res.status(201).json(gender);
        })
        .catch((err) =>
          res.status(500).json({message: Messages.ERROR_CREATE_GENDER}),
        );
  };

  // GET GENDER BY ID
  static getGenderById = async (req, res) => {
    let id = 0;
    try {
      id = Number.parseInt(req.params.id);
    } catch {
      return res.status(404).json({message: Messages.NOTHING_FOUND});
    }

    database('gender')
        .where('gender.id', id)
        .select(
            'gender.id',
            'gender.description',
            'gender.created_at',
            'gender.updated_at',
        )
        .then((genders) => {
          if (genders.length > 0) {
            res.status(200).json(genders[0]);
          } else {
            res.status(404).json({message: Messages.NOTHING_FOUND});
          }
        });
  };

  // UPDATE GENDER BY ID
  static updateGenderById = async (req, res) => {
    let id = 0;
    try {
      id = Number.parseInt(req.params.id);
    } catch {
      return res.status(404).json({message: Messages.NOTHING_FOUND});
    }

    const gender = {
      description: req.body.description,
      updated_at: DateTimeUtil.getCurrentDateTime(),
    };

    try {
      await database('gender')
          .where('id', id)
          .update(gender)
          .then((numAffectedRegisters) => {
            if (numAffectedRegisters == 0) {
              res.status(404).json({message: Messages.NOTHING_FOUND});
            } else {
              res.status(201).json({gender});
            }
          });
    } catch (err) {
      return res.status(500).json({
        message: Messages.ERROR_UPDATING_GENDER,
        details: `${err.message}`,
      });
    }
  };

  // DELETE GENDER BY ID
  static deleteGenderById = async (req, res) => {
    let id = 0;
    try {
      id = Number.parseInt(req.params.id);
    } catch {
      return res.status(404).json({message: Messages.NOTHING_FOUND});
    }

    database('gender')
        .where('gender.id', id)
        .select('gender.id')
        .then((genders) => {
          if (genders.length > 0) {
            const gender = genders[0];
            database('gender')
                .where('id', gender.id)
                .del()
                .then(res.status(200).json({message: Messages.GENDER_DELETED}))
                .catch((err) => {
                  res
                      .status(500)
                      .json({
                        message: Messages.ERROR_DELETE_GENDER,
                        details: `${err.message}`,
                      });
                });
          } else {
            res.status(404).json({message: Messages.NOTHING_FOUND});
          }
        });
  };
}

module.exports = GenderController;
