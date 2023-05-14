const express = require('express');
const diabetesTypeRouter = express.Router();
const DiabetesTypeController = require('../controllers/diabetesTypeController');
const {checkToken, isAdmin} = require('../utils/securityUtils');

diabetesTypeRouter
    .get('/', checkToken, isAdmin, DiabetesTypeController.getAllTypes)
    .post('/', checkToken, isAdmin, DiabetesTypeController.createNewType)
    .get('/:id', checkToken, isAdmin, DiabetesTypeController.getTypeById)
    .put('/:id', checkToken, isAdmin, express.json(), DiabetesTypeController.updateTypeById)
    .delete('/:id', checkToken, isAdmin, express.json(), DiabetesTypeController.deleteTypeById);

module.exports = diabetesTypeRouter;
