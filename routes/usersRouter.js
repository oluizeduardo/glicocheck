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


// CREATE A NEW USER.
usersRouter.post('/users', express.json(), function (req, res) {
    knex('users')
        .insert({
            name: req.body.name,
            email: req.body.email,
            login: req.body.login,
            password: req.body.password,
            roles: req.body.roles
        }, 
        ['id', 'name', 'email', 'login', 'roles'])
    .then(users => {
        let user = users[0];
        res.json({user});
    })
    .catch(err => res.status(500).json({message}))
})

// READ ALL USERS.
usersRouter.get('/users', function (req, res) {
    knex.select('id', 'name', 'email', 'login', 'roles')
        .from('users')
        .then(users => res.json(users))
})

// READ A USER BASED ON HIS ID.
usersRouter.get('/users/:id', function (req, res) {
    let id = Number.parseInt(req.params.id);
    knex.select('id', 'name', 'email', 'roles')
        .from('users')
        .where('id',id)
        .then(users => {
            if(users.length){
                res.json(users);
            }else{
                res.status(404).json({message: `User with id ${id} was not found.`})
            }
        });
})

// UPDATE A USER BASED ON HIS ID.
usersRouter.put('/users/:id', express.json(), function (req, res) {
    let id = Number.parseInt(req.params.id);
    if (id > 0) {
        knex('users')
            .where('id', id)
            .update({
                name: req.body.name,
                email: req.body.email,
                login: req.body.login,
                password: req.body.password,
                roles: req.body.roles
            },
            ['id', 'name','email','login', 'roles'])
            .then (users => {
                let user = users[0]
                res.status(200).json({user})
            })
            .catch (err => res.status(500).json ({ message: `Error trying to update user. ERROR: ${err.message}`}))
    } else {
        res.status(404).json({ message: "User not found!" })
    }
})

// DELETE A USER BASED ON HIS ID.
usersRouter.delete('/users/:id', function (req, res) {
    let id = Number.parseInt(req.params.id)

    if (id > 0) {
        knex('users')
          .where('id', id)
          .del()
          .then(res.status(200).json({message: `User ${id} has been deleted!`}))
          .catch (err => res.status(500).json ({ message: `Error trying to delete user. ERROR: ${err.message}`}))
    } else {
        res.status(404).json({
            message: "Product not found."
        })
    }        
})

module.exports = usersRouter