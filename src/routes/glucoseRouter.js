const express = require('express');
const jwt = require('jsonwebtoken');
const glucoseRouter = express.Router();
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
              error: err.message })
        })
};



// READ ALL GLUCOSE RECORDS.
glucoseRouter.get('/', checkToken, function (req, res) {
    database('glucose')
        .join('users', 'users.id', 'glucose.user_id')
        .join('marker_meal', 'marker_meal.id', 'glucose.markermeal_id')
        .join('measurement_unity', 'measurement_unity.id', 'glucose.unity_id')
        .select('glucose.id', 'users.id as userId', 'users.name as user',
                'glucose.glucose', 'measurement_unity.description as unity',
                'glucose.date', 'glucose.hour', 'marker_meal.description as markerMeal')
        .orderBy([
            {column: 'glucose.date', order: 'asc'},
            {column: 'glucose.hour', order: 'asc'}
        ])       
        .then(glucoses => {
            if(glucoses.length){
                res.status(200).json(glucoses);
            }else{
                res.status(404).json({message: Messages.NOTHING_FOUND})
            }
        });
})


// GET ALL GLUCOSE READING OF A SPECIFIC USER ID.
glucoseRouter.get('/user/:user_id', checkToken, function (req, res) {
    let id = Number.parseInt(req.params.user_id);

    database('glucose')
        .where('glucose.user_id', id)
        .join('users', 'users.id', 'glucose.user_id')
        .join('marker_meal', 'marker_meal.id', 'glucose.markermeal_id')
        .join('measurement_unity', 'measurement_unity.id', 'glucose.unity_id')
        .select('glucose.id', 'users.id as userId', 'users.name as user',
                'glucose.glucose', 'measurement_unity.description as unity',
                'glucose.date', 'glucose.hour', 'marker_meal.description as markerMeal')
        .orderBy([
            {column: 'glucose.date', order: 'asc'},
            {column: 'glucose.hour', order: 'asc'}
        ])
        .then(glucoses => {
            if(glucoses.length){
                res.status(200).json(glucoses);
            }else{
                res.status(404).json({message: Messages.NOTHING_FOUND})
            }
        });
})


// GET A GLUCOSE READING BASED ON ID PARAMETER.
glucoseRouter.get('/:id', checkToken, function (req, res) {
    let id = Number.parseInt(req.params.id);
    database('glucose')
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
                res.status(404).json({message: Messages.NOTHING_FOUND})
            }
        });
})


// GET ALL GLUCOSE READING BY MARKERMEAL ID.
glucoseRouter.get('/markermeal/:markermealid', checkToken, function (req, res) {
    let markermealid = Number.parseInt(req.params.markermealid);
    database('glucose')
        .where('glucose.markermeal_id', markermealid)
        .join('users', 'users.id', 'glucose.user_id')
        .join('marker_meal', 'marker_meal.id', 'glucose.markermeal_id')
        .join('measurement_unity', 'measurement_unity.id', 'glucose.unity_id')
        .select('glucose.id', 'users.id as userId', 'users.name as userName', 
                'glucose.glucose', 'measurement_unity.description as unity',
                'glucose.date', 'glucose.hour', 'marker_meal.description as markerMeal')
        .orderBy([
            {column: 'glucose.date', order: 'asc'},
            {column: 'glucose.hour', order: 'asc'}
        ])
        .then(glucoses => {
            if(glucoses.length){
                res.status(200).json(glucoses);
            }else{
                res.status(404).json({message: Messages.NOTHING_FOUND})
            }
        });
})


// CREATE A NEW GLUCOSE READING. ONLY ADMIN ROLE.
glucoseRouter.post('/', express.json(), checkToken, isAdmin, function (req, res) {
    database('glucose')
        .insert({
            user_id: req.body.userId,
            glucose: req.body.glucose,
            unity_id: req.body.unityId,
            date: req.body.date,
            hour: req.body.hour,
            markermeal_id: req.body.markerMealId
        }, 
        ['id', 'user_id', 'glucose', 'unity_id', 'date', 'hour', 'markermeal_id'])
    .then(glucoses => {
        let glucose = glucoses[0];
        res.json({glucose});
    })
    .catch(err => res.status(500).json({err}))
})


// UPDATE A GLUCOSE READING BASED ON ID PARAMETER. ONLY ADMIN ROLE.
glucoseRouter.put('/:id', express.json(), checkToken, isAdmin, function (req, res) {
    let id = Number.parseInt(req.params.id);
   
    let response = database('glucose')
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
                res.status(404).json({message: Messages.NOTHING_FOUND})
            }
        })
        .catch (err => res.status(500)
        .json ({ message: Messages.ERROR_UPDATE_GLUCOSE,
                 error: err.message }))
})


// DELETE A GLUCOSE READING BASED ON ID PARAMETER. ONLY ADMIN ROLE.
glucoseRouter.delete('/:id', checkToken, isAdmin, function (req, res) {
    let id = Number.parseInt(req.params.id)

    if (id > 0) {
        database('glucose')
          .where('id', id)
          .del()
          .then(res.status(200).json({message: Messages.REGISTER_DELETED }))
          .catch (err => res.status(500)
          .json ({ message: Messages.ERROR_DELETE_GLUCOSE,
                   error: err.message}))
    } else {
        res.status(404).json({
            message: Messages.NOTHING_FOUND
        })
    }        
})


// DELETE ALL GLUCOSE REGISTERS OF A SPECIFIC USER.
glucoseRouter.delete('/user/:userId', checkToken, isAdmin, function (req, res) {
    let userId = Number.parseInt(req.params.userId)

    if (userId > 0) {
        database('glucose')
          .where('user_id', userId)
          .del()
          .then(res.status(200).json({message: Messages.REGISTER_DELETED }))
          .catch (err => res.status(500)
          .json ({ message: Messages.ERROR_DELETE_GLUCOSE,
                   error: err.message}))
    } else {
        res.status(404).json({
            message: Messages.NOTHING_FOUND
        })
    }        
})

module.exports = glucoseRouter