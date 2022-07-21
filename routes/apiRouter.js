const express = require('express')
const apiRouter = express.Router ();

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

apiRouter.get('/users', function (req, res) {
    knex.select('*').from('users').then(users => res.json(users))
})

apiRouter.get('/users/:id', function (req, res) {
    let id = Number.parseInt(req.params.id);
    knex.select('name', 'email', 'roles')
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

module.exports = apiRouter