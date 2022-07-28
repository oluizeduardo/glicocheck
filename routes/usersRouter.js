const express = require('express')
const usersRouter = express.Router ();

// CONFIG TO CONNECT WITH THE DATABASE.
const knex = require ('knex') ({
    client: 'pg',// POSTGRESQL
    connection: {
        connectionString: process.env.DATABASE_URL,// Look up at .env file.
        ssl: {
            rejectUnauthorized: false
        },
    }
})


const MESSAGE_NOTHING_FOUND = "Nothing found";


// READ ALL USERS.
usersRouter.get('/', function (req, res) {
    knex('users')
        .join('role', 'users.role_id', 'role.id')
        .select('users.id', 'users.name', 'users.email', 'users.login', 'role.description as role')
        .then(users => {
            if(users.length){
                res.status(200).json(users);
            }else{
                res.status(200).json({message: MESSAGE_NOTHING_FOUND})
            }
        });
})


// READ A USER BASED ON HIS ID.
usersRouter.get('/:id', function (req, res) {
    let id = Number.parseInt(req.params.id);
    knex('users')
        .where('users.id', id)
        .join('role', 'users.role_id', 'role.id')
        .select('users.id', 'users.name', 'users.email', 'users.login', 'role.description as role')
        .then(users => {
            if(users.length){
                res.status(200).json(users);
            }else{
                res.status(404).json({message: MESSAGE_NOTHING_FOUND})
            }
        });
})


// UPDATE A USER BASED ON HIS ID.
usersRouter.put('/:id', express.json(), function (req, res) {
    let id = Number.parseInt(req.params.id);
   
    let response = knex('users')
        .where('id', id)
        .update({
            name: req.body.name,
            email: req.body.email,
            login: req.body.login,
            password: req.body.password,
            role_id: req.body.role_id
        },
        ['id', 'name','email','login', 'role_id']);

    response.then (users => {            
            if(users.length){
                let user = users[0]
                res.status(201).json({user})
            }else{
                res.status(404).json({message: MESSAGE_NOTHING_FOUND})
            }
        })
        .catch (err => res.status(500)
        .json ({ message: `Error trying to update user. ERROR: ${err.message}`}))
})


// DELETE A USER BASED ON HIS ID.
usersRouter.delete('/:id', function (req, res) {
    let id = Number.parseInt(req.params.id)

    if (id > 0) {
        knex('users')
          .where('id', id)
          .del()
          .then(res.status(200).json({message: `User ${id} has been deleted!`}))
          .catch (err => res.status(500).json ({ message: `Error trying to delete user. ERROR: ${err.message}`}))
    } else {
        res.status(404).json({
            message: MESSAGE_NOTHING_FOUND
        })
    }        
})

module.exports = usersRouter