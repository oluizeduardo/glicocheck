const express = require('express')
const markerMealRouter = express.Router ();
const jwt = require('jsonwebtoken');
const Messages = require('../utils/messages');
const database = require('../db/dbconfig.js');


// Authenticate password
let checkToken = (req, res, next) => {
    let authToken = req.headers['authorization'];
    if (!authToken) {        
        res.status(401).json({ message: Messages.TOKEN_REQUIRED});
        return;
    }
    else {
        let token = authToken.split(' ')[1];
        req.token = token;
    }

    jwt.verify(req.token, process.env.SECRET_KEY, (err, decodeToken) => {
        if (err) {
            if(err.name === 'TokenExpiredError'){
                res.status(401).json({ message: Messages.TOKEN_EXPIRED, expiredIn: err.expiredAt});
                return
            }
            res.status(401).json({ message: Messages.REFUSED_ACCESS });
            return

        }
        req.userId = decodeToken.id
        next()
    })
};

// CHECK USER ROLE.
let isAdmin = (req, res, next) => {
    database
        .select ('*').from ('users').where({ id: req.userId })
        .then ((users) => {
            if (users.length) {
                let user = users[0]
                let role = user.role_id;
                
                if (role === 1) {
                    next()
                    return
                }
                else {
                    res.status(403).json({ message: Messages.ROLE_ADMIN_REQUIRED })
                    return
                }
            }
        })
        .catch (err => {
            res.status(500).json({ 
              message: Messages.ERROR_CHECKING_USER_ROLE,
              error: err.message 
            })
        })
};


// READ ALL MARKERS.
markerMealRouter.get('/', checkToken, function (req, res) {
    database
        .select('*')
        .from('marker_meal')
        .then(markers => {
            if(markers.length){
                res.status(200).json(markers);
            }else{
                res.status(200).json({message: Messages.NOTHING_FOUND})
            }
        });
})


// READ A MARKER MEAL BASED ON ID.
markerMealRouter.get('/:id', checkToken, function (req, res) {
    let id = Number.parseInt(req.params.id);
    database('marker_meal')
        .where('id', id)
        .select('id', 'description')
        .then(markers => {
            if(markers.length){
                res.status(200).json(markers);
            }else{
                res.status(200).json({message: Messages.NOTHING_FOUND})
            }
        });
})


// CREATE A NEW MARKER MEAL.
markerMealRouter.post('/', checkToken, isAdmin, express.json(), function (req, res) {
    database('marker_meal')
        .insert({
            description: req.body.description
        }, 
        ['id', 'description'])
    .then(markers => {
        let marker = markers[0];
        res.status(201).json({marker_meal: marker});
    })
    .catch(err => res.status(500).json({message: Messages.ERROR_CREATE_MARKERMEAL}))
})


// UPDATE A MARKER MEAL BASED ON ID.
markerMealRouter.put('/:id', checkToken, isAdmin, express.json(), function (req, res) {
    let id = Number.parseInt(req.params.id);
   
    database('marker_meal')
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
})


// DELETE A MARKER BASED ON ID.
markerMealRouter.delete('/:id', checkToken, isAdmin, function (req, res) {
    let id = Number.parseInt(req.params.id)

    if (id > 0) {
        database('marker_meal')
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
})

module.exports = markerMealRouter;