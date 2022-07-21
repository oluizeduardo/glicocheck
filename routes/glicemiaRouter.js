const express = require('express')
const glicemiaRouter = express.Router ();

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

// READ ALL GLICEMIA RECORDS.
glicemiaRouter.get('/glicemia', function (req, res) {
    knex.select('*').from('glicemia').then(glicemias => res.json(glicemias))
})

// CREATE A NEW GLICEMIA READING.
glicemiaRouter.post('/glicemia', express.json(), function (req, res) {
    knex('glicemia')
        .insert({
            user_id: req.body.userId,
            glicemia: req.body.glicemia,
            unity: req.body.unity,
            date: req.body.date,
            hour: req.body.hour,
            marker_meal: req.body.markerMeal
        }, 
        ['glicemia', 'unity', 'date', 'hour'])
    .then(glicemias => {
        let glicemia = glicemias[0];
        res.json({glicemia});
    })
    .catch(err => res.status(500).json({message}))
})

module.exports = glicemiaRouter