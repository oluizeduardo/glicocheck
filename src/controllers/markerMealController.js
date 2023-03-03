const Messages = require('../utils/messages');
const database = require('../db/dbconfig.js');

class MarkerMealController {

    // GET ALL MARKER MEALS
    static getAllMarkerMeals = async (req, res) => {
        await database
            .select('*')
            .from('marker_meal')
            .then(markers => {
                if(markers.length){
                    res.status(200).json(markers);
                }else{
                    res.status(200).json({message: Messages.NOTHING_FOUND})
                }
            });
    }

    // GET MARKER MEAL BY ID
    static getMarkerMealById = async (req, res) => {
        let id = Number.parseInt(req.params.id);
        await database('marker_meal')
            .where('id', id)
            .select('id', 'description')
            .then(markers => {
                if(markers.length){
                    res.status(200).json(markers);
                }else{
                    res.status(200).json({message: Messages.NOTHING_FOUND})
                }
            });
    }

    // CREATE NEW MARKER MEAL
    static createNewMarkerMeal = async (req, res) => {
        await database('marker_meal')
            .insert({
                description: req.body.description
            }, 
            ['id', 'description'])
        .then(markers => {
            let marker = markers[0];
            res.status(201).json({marker_meal: marker});
        })
        .catch(err => res.status(500).json({message: Messages.ERROR_CREATE_MARKERMEAL}))
    }

    // UPDATE MARKER MEAL BY ID
    static updateMarkerMealById = async (req, res) => {
        let id = Number.parseInt(req.params.id);
       
        await database('marker_meal')
            .where('id', id)
            .update({ description: req.body.description },['id', 'description'])
            .then (markers => {            
                if(markers.length){
                    let marker = markers[0]
                    res.status(201).json({marker})
                }else{
                    res.status(404).json({message: Messages.NOTHING_FOUND})
                }
            })
            .catch (err => res.status(500)
            .json ({ message: Messages.ERROR_UPDATE_MARKERMEAL,
                     error: err.message}))
    }

    // DELETE BY ID
    static deleteMarkerMealById = async (req, res) => {
        let id = Number.parseInt(req.params.id)
    
        if (id > 0) {
            await database('marker_meal')
              .where('id', id)
              .del()
              .then(res.status(200).json({message: Messages.REGISTER_DELETED}))
              .catch (err => res.status(500)
                    .json ({ message: Messages.ERROR_DELETE_MARKERMEAL,
                        error: err.message}))
        } else {
            res.status(404).json({
                message: Messages.NOTHING_FOUND
            })
        }        
    }

}

module.exports = MarkerMealController