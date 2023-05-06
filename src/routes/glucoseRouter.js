const express = require('express');
const glucoseRouter = express.Router();
const GlucoseController = require('../controllers/glucoseController');
const {checkToken, isAdmin} = require('../utils/securityUtils');

glucoseRouter
    .get('/', express.json(), checkToken, GlucoseController.getAllGlucoseRecords)
    .post('/', express.json(), checkToken, isAdmin, GlucoseController.createNewGlucoseRecord)
    .get('/:id', checkToken, GlucoseController.getGlucoseById)
    .put('/:id', express.json(), checkToken, isAdmin, GlucoseController.updateGlucoseRecordById)
    .delete('/:id', checkToken, isAdmin, GlucoseController.deleteGlucoseRecordById)
    .get('/user/online', checkToken, GlucoseController.getGlucoseRecordsByUserId)
    .delete('/user/:userId', checkToken, isAdmin, GlucoseController.deleteGlucoseRecordsByUserId)
    .get('/markermeal/:markermealid', checkToken, GlucoseController.getGlucoseRecordsByMarkerMealId);

module.exports = glucoseRouter;
