const express = require('express');
const bloodTypeRouter = express.Router();
const BloodTypeController = require('../controllers/bloodTypeController');
const {checkToken, isAdmin} = require('../utils/securityUtils');

bloodTypeRouter
    .get('/', checkToken, isAdmin, BloodTypeController.getAllTypes)
    .post('/', checkToken, isAdmin, BloodTypeController.createNewType)
    .get('/:id', checkToken, isAdmin, BloodTypeController.getTypeById)
    .put('/:id', checkToken, isAdmin, express.json(), BloodTypeController.updateTypeById)
    .delete('/:id', checkToken, isAdmin, express.json(), BloodTypeController.deleteTypeById);

module.exports = bloodTypeRouter;
