const express = require('express');
const glucoseRouter = express.Router();
const GlucoseController = require('../controllers/glucoseController');
const {checkToken, isAdmin} = require('../utils/securityUtils');

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