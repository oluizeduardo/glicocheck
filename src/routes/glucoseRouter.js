const express = require('express');
const glucoseRouter = express.Router();
const GlucoseController = require('../controllers/glucoseController');
const {checkToken, isAdmin} = require('../utils/securityUtils');

glucoseRouter.use(checkToken);
glucoseRouter.use(isAdmin);

glucoseRouter
    .get('/', express.json(), GlucoseController.getAllGlucoseRecords)
    .post('/', express.json(), GlucoseController.createNewGlucoseRecord)
    .get('/:id', GlucoseController.getGlucoseById)
    .put('/:id', express.json(), GlucoseController.updateGlucoseRecordById)
    .delete('/:id', GlucoseController.deleteGlucoseRecordById)
    .get('/user/online', GlucoseController.getGlucoseRecordsByUserId)
    .delete('/user/:userId', GlucoseController.deleteGlucoseRecordsByUserId)
    .get('/markermeal/:markermealid', GlucoseController.getGlucoseRecordsByMarkerMealId);

module.exports = glucoseRouter;
