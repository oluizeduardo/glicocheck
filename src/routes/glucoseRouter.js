const express = require('express');
const jwt = require('jsonwebtoken');
const glucoseRouter = express.Router();
const Messages = require('../utils/messages');
const database = require('../db/dbconfig.js');
const GlucoseController = require('../controllers/glucoseController');


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

glucoseRouter
    .get('/', checkToken, GlucoseController.getAllGlucoseRecords)
    .post('/', express.json(), checkToken, isAdmin, GlucoseController.createNewGlucoseReading)
    .get('/:id', checkToken, GlucoseController.getGlucoseById)
    .put('/:id', express.json(), checkToken, isAdmin, GlucoseController.updateGlucoseReadingById)
    .delete('/:id', checkToken, isAdmin, GlucoseController.deleteGlucoseReadingById)
    .get('/user/:userId', checkToken, GlucoseController.getGlucoseReadingsByUserId)
    .delete('/user/:userId', checkToken, isAdmin, GlucoseController.deleteGlucoseReadingsByUserId)
    .get('/markermeal/:markermealid', checkToken, GlucoseController.getGlucoseReadingsByMarkerMealId);

module.exports = glucoseRouter