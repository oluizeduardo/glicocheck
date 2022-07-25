const express = require('express')
const glucoseRouter = express.Router();

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


// READ ALL GLUCOSE RECORDS.
glucoseRouter.get('/glucose', function (req, res) {
    knex
        .select('*')
        .from('glucose')
        .then(glucoses => {
            if(glucoses.length){
                res.status(200).json(glucoses);
            }else{
                res.status(200).json({message: `Nothing found.`})
            }
        });
})


// READ A GLUCOSE READING BASED ON ITS ID.
glucoseRouter.get('/glucose/:id', function (req, res) {
    let id = Number.parseInt(req.params.id);
    knex('glucose')
        .where('glucose.id', id)
        .join('users', 'users.id', 'glucose.user_id')
        .join('marker_meal', 'marker_meal.id', 'glucose.markermeal_id')
        .join('measurement_unity', 'measurement_unity.id', 'glucose.unity_id')
        .select('glucose.id', 'users.id as userId', 'users.name as userName', 
                'glucose.glucose', 'measurement_unity.description as unity',
                'glucose.date', 'glucose.hour', 'marker_meal.description as markerMeal')
        .then(glucoses => {
            if(glucoses.length){
                res.status(200).json(glucoses);
            }else{
                res.status(404).json({message: `User not found.`})
            }
        });
})


// CREATE A NEW GLUCOSE READING.
glucoseRouter.post('/glucose', express.json(), function (req, res) {
    knex('glucose')
        .insert({
            user_id: req.body.userId,
            glucose: req.body.glucose,
            unity_id: req.body.unityId,
            date: req.body.date,
            hour: req.body.hour,
            markermeal_id: req.body.markerMealId
        }, 
        ['user_id', 'glucose', 'unity_id', 'date', 'hour', 'markermeal_id'])
    .then(glucoses => {
        let glucose = glucoses[0];
        res.json({glucose});
    })
    .catch(err => res.status(500).json({err}))
})


// UPDATE A GLUCOSE READING BASED ON ITS ID.
glucoseRouter.put('/glucose/:id', express.json(), function (req, res) {
    let id = Number.parseInt(req.params.id);
   
    let response = knex('glucose')
        .where('id', id)
        .update({
            glucose: req.body.glucose,
            unity_id: req.body.unityId,
            date: req.body.date,
            hour: req.body.hour,
            markermeal_id: req.body.markerMealId
        },
        ['glucose', 'unity_id','date','hour', 'markermeal_id']);

    response.then (glucoses => {            
            if(glucoses.length){
                let glucose = glucoses[0]
                res.status(201).json({glucose})
            }else{
                res.status(404).json({message: `Register not found.`})
            }
        })
        .catch (err => res.status(500)
        .json ({ message: `Error trying to update glucose reading. ERROR: ${err.message}`}))
})


// DELETE A GLUCOSE READING BASED ON ITS ID.
glucoseRouter.delete('/glucose/:id', function (req, res) {
    let id = Number.parseInt(req.params.id)

    if (id > 0) {
        knex('glucose')
          .where('id', id)
          .del()
          .then(res.status(200).json({message: `The glucose reading with id ${id} has been deleted!`}))
          .catch (err => res.status(500).json ({ message: `Error trying to delete glucose reading. ERROR: ${err.message}`}))
    } else {
        res.status(404).json({
            message: "Register not found."
        })
    }        
})

module.exports = glucoseRouter