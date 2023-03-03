const Messages = require('../utils/messages');
const database = require('../db/dbconfig.js');
const bcrypt = require('bcryptjs'); 

class UserController {

    // GET ALL USERS
    static getAllUsers = async (req, res) => {
        database('users')
            .join('role', 'users.role_id', 'role.id')
            .select('users.id', 'users.name', 'users.email', 'role.description as role',
                    'users.created_at', 'users.updated_at')
            .then(users => {
                if(users.length){
                    res.status(200).json(users);
                }else{
                    res.status(200).json({message: Messages.MESSAGE_NOTHING_FOUND})
                }
            });
    }

    // GET USER BY ID
    static getUserById = async (req, res) => {
        let id = Number.parseInt(req.params.id);
        database('users')
            .where('users.id', id)
            .join('role', 'users.role_id', 'role.id')
            .select('users.id', 'users.name', 'users.email', 'role.description as role', 
                    'users.created_at', 'users.updated_at')
            .then(users => {
                if(users.length){
                    let user = users[0];
                    res.status(200).json({user});
                }else{
                    res.status(404).json({message: Messages.MESSAGE_NOTHING_FOUND})
                }
            });
    }

    // UPDATE USER BY ID
    static updateUserById = async (req, res) => {
        let id = Number.parseInt(req.params.id);
        let user = {
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8),
            role_id: req.body.role_id,
            updated_at: new Date().toLocaleString('pt-BR', { timeZone: 'UTC' })
        }
       
        try{
            await database('users')
            .where('id', id)
            .update(user)
            .then (numAffectedRegisters => {
                if(numAffectedRegisters == 0)
                {
                    res.status(404).json({message: 'Nothing found'});                    
                }else{
                    res.status(201).json({user});
                }
            });
        }catch (err) {
            return res
                .status(500)
                .json ({ 
                    message: `Error trying to update user.`,
                    details: `${err.message}`
                });
        }
    }

    // DELETE USER BY ID
    static deleteUserById = async (req, res) => {
        let id = Number.parseInt(req.params.id)
    
        if (id > 0) {
            database('users')
              .where('id', id)
              .del()
              .then(res.status(200).json({message: `User ${id} has been deleted!`}))
              .catch (err => res.status(500).json ({ message: Messages.ERROR_DELETE_USER + `ERROR: ${err.message}`}))
        } else {
            res.status(404).json({
                message: Messages.MESSAGE_NOTHING_FOUND
            })
        }        
    }

}

module.exports = UserController