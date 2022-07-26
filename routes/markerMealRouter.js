const express = require('express')
const markerMealRouter = express.Router ();

// CONFIG TO CONNECT WITH THE DATABASE.
const knex = require ('knex') ({
    client: 'pg',// POSTGRESQL
    connection: {
        connectionString: process.env.DATABASE_URL,// Look up at .env file.
        ssl: {
            rejectUnauthorized: false
        },
    }
});


// READ ALL MARKERS.
markerMealRouter.get('/markermeal', function (req, res) {
    knex
        .select('*')
        .from('marker_meal')
        .then(markers => {
            if(markers.length){
                res.status(200).json(markers);
            }else{
                res.status(200).json({message: `Nothing found.`})
            }
        });
})


// READ A MARKER MEAL BASED ON ID.
markerMealRouter.get('/markermeal/:id', function (req, res) {
    let id = Number.parseInt(req.params.id);
    knex('marker_meal')
        .where('id', id)
        .select('id', 'description')
        .then(markers => {
            if(markers.length){
                res.status(200).json(markers);
            }else{
                res.status(200).json({message: `Nothing found.`})
            }
        });
})


// CREATE A NEW MARKER MEAL.
markerMealRouter.post('/markermeal', express.json(), function (req, res) {
    knex('marker_meal')
        .insert({
            description: req.body.description
        }, 
        ['id', 'description'])
    .then(markers => {
        let marker = markers[0];
        res.status(201).json({marker});
    })
    .catch(err => res.status(500).json({message: `Error trying to create a new marker meal.`}))
})


// UPDATE A MARKER MEAL BASED ON ID.
markerMealRouter.put('/markermeal/:id', express.json(), function (req, res) {
    let id = Number.parseInt(req.params.id);
   
    knex('marker_meal')
        .where('id', id)
        .update({ description: req.body.description },['id', 'description'])
        .then (markers => {            
            if(markers.length){
                let marker = markers[0]
                res.status(201).json({marker})
            }else{
                res.status(404).json({message: `Marker meal not found.`})
            }
        })
        .catch (err => res.status(500)
        .json ({ message: `Error trying to update a marker. ERROR: ${err.message}`}))
})


// DELETE A MARKER BASED ON ID.
markerMealRouter.delete('/markermeal/:id', function (req, res) {
    let id = Number.parseInt(req.params.id)

    if (id > 0) {
        knex('marker_meal')
          .where('id', id)
          .del()
          .then(res.status(200).json({message: `Marker ${id} has been deleted!`}))
          .catch (err => res.status(500).json ({ message: `Error trying to delete a marker meal. ERROR: ${err.message}`}))
    } else {
        res.status(404).json({
            message: "Register not found."
        })
    }        
})

module.exports = markerMealRouter;