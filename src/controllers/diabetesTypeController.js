const Messages = require('../utils/messages');
const database = require('../db/dbconfig.js');
const DateTimeUtil = require('../utils/dateTimeUtil');
/**
 * DiabetesTypeController.
 */
class DiabetesTypeController {
  // GET ALL TYPES
  static getAllTypes = async (req, res) => {
    database('diabetes_type')
        .select(
            'diabetes_type.id',
            'diabetes_type.description',
            'diabetes_type.created_at',
            'diabetes_type.updated_at',
        )
        .then((types) => {
          if (types.length > 0) {
            res.status(200).json(types);
          } else {
            res.status(404).json({message: Messages.NOTHING_FOUND});
          }
        });
  };

  // CREATE NEW TYPE
  static createNewType = async (req, res) => {
    await database('diabetes_type')
        .insert(
            {
              description: req.body.description,
            },
            ['id', 'description', 'created_at', 'updated_at'],
        )
        .then((types) => {
          res.status(201).json(types[0]);
        })
        .catch((err) =>
          res.status(500).json({message: Messages.ERROR_CREATE_DIABETES_TYPE}),
        );
  };

  // GET DIABETES TYPE BY ID
  static getTypeById = async (req, res) => {
    let id = 0;
    try {
      id = Number.parseInt(req.params.id);
    } catch {
      return res.status(404).json({message: Messages.NOTHING_FOUND});
    }

    database('diabetes_type')
        .where('diabetes_type.id', id)
        .select(
            'diabetes_type.id',
            'diabetes_type.description',
            'diabetes_type.created_at',
            'diabetes_type.updated_at',
        )
        .then((types) => {
          if (types.length > 0) {
            res.status(200).json(types[0]);
          } else {
            res.status(404).json({message: Messages.NOTHING_FOUND});
          }
        });
  };

  // UPDATE TYPE BY ID
  static updateTypeById = async (req, res) => {
    let id = 0;
    try {
      id = Number.parseInt(req.params.id);
    } catch {
      return res.status(404).json({message: Messages.NOTHING_FOUND});
    }

    const newType = {
      description: req.body.description,
      updated_at: DateTimeUtil.getCurrentDateTime(),
    };

    try {
      await database('diabetes_type')
          .where('id', id)
          .update(newType)
          .then((numAffectedRegisters) => {
            if (numAffectedRegisters == 0) {
              res.status(404).json({message: Messages.NOTHING_FOUND});
            } else {
              res.status(201).json(newType);
            }
          });
    } catch (err) {
      return res.status(500).json({
        message: Messages.ERROR_UPDATING_DIABETES_TYPE,
        details: `${err.message}`,
      });
    }
  };

  // DELETE TYPE BY ID
  static deleteTypeById = async (req, res) => {
    let id = 0;
    try {
      id = Number.parseInt(req.params.id);
    } catch {
      return res.status(404).json({message: Messages.NOTHING_FOUND});
    }

    database('diabetes_type')
        .where('diabetes_type.id', id)
        .select('diabetes_type.id')
        .then((types) => {
          if (types.length > 0) {
            const type = types[0];
            database('diabetes_type')
                .where('id', type.id)
                .del()
                .then(res.status(200).json({
                  message: Messages.DIABETES_TYPE_DELETED
                }))
                .catch((err) => {
                  res
                      .status(500)
                      .json({
                        message: Messages.ERROR_DELETE_DIABETES_TYPE,
                        details: `${err.message}`,
                      });
                });
          } else {
            res.status(404).json({message: Messages.NOTHING_FOUND});
          }
        });
  };
}

module.exports = DiabetesTypeController;
