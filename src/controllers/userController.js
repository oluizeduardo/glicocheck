const Messages = require('../utils/messages');
const database = require('../db/dbconfig.js');
const DateTimeUtil = require('../utils/dateTimeUtil');
/**
 * UserController.
 */
class UserController {
  // GET ALL USERS
  static getAllUsers = async (req, res) => {
    database('users')
        .join('role', 'users.role_id', 'role.id')
        .select(
            'users.id',
            'users.name',
            'users.email',
            'users.birthdate',
            'users.phone',
            'users.gender_id',
            'users.weight',
            'users.height',
            'users.health_id',
            'role.description as role',
            'users.created_at',
            'users.updated_at',
        )
        .then((users) => {
          if (users.length) {
            res.status(200).json(users);
          } else {
            res.status(200).json({message: Messages.MESSAGE_NOTHING_FOUND});
          }
        });
  };

  // GET USER BY ID
  static getUserById = async (req, res) => {
    const id = req.params.id;
    database('users')
        .where('users.id', id)
        .join('role', 'users.role_id', 'role.id')
        .select(
            'users.id',
            'users.name',
            'users.email',
            'users.birthdate',
            'users.phone',
            'users.gender_id',
            'users.health_id',
            'users.weight',
            'users.height',
            'users.picture',
            'role.description as role',
            'users.created_at',
            'users.updated_at',
        )
        .then((users) => {
          if (users.length) {
            const user = users[0];
            res.status(200).json({user});
          } else {
            res.status(404).json({message: Messages.MESSAGE_NOTHING_FOUND});
          }
        });
  };

  // UPDATE USER BY ID
  static updateUserById = async (req, res) => {
    const id = req.params.id;

    const user = {
      name: req.body.name,
      email: req.body.email,
      birthdate: req.body.birthdate,
      phone: req.body.phone,
      gender_id: req.body.gender_id,
      weight: req.body.weight,
      height: req.body.height,
      picture: req.body.picture,
      role_id: req.body.role_id,
      updated_at: DateTimeUtil.getCurrentDateTime(),
    };

    try {
      await database('users')
          .where('id', id)
          .update(user)
          .then((numAffectedRegisters) => {
            if (numAffectedRegisters == 0) {
              res.status(404).json({message: Messages.NOTHING_FOUND});
            } else {
              res.status(201).json({user});
            }
          });
    } catch (err) {
      return res.status(500).json({
        message: Messages.ERROR_UPDATING_USER,
        details: `${err.message}`,
      });
    }
  };

  // DELETE USER BY ID
  static deleteUserById = async (req, res) => {
    const id = req.params.id;
    database('users')
        .where('users.id', id)
        .select('users.id')
        .then((users) => {
          if (users.length > 0) {
            const user = users[0];
            database('users')
                .where('id', user.id)
                .del()
                .then(res.status(200).json({message: Messages.USER_DELETED}))
                .catch((err) => {
                  res
                      .status(500)
                      .json({
                        message: Messages.ERROR_DELETE_USER,
                        details: `${err.message}`,
                      });
                });
          } else {
            // User not found to delete.
            res.status(404).json({message: Messages.MESSAGE_NOTHING_FOUND});
          }
        });
  };
}

module.exports = UserController;
