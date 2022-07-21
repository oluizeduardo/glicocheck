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

module.exports = apiRouter