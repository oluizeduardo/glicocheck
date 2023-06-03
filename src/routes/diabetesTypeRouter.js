const express = require('express');
const diabetesTypeRouter = express.Router();
const DiabetesTypeController = require('../controllers/diabetesTypeController');
const {checkToken, isAdmin} = require('../utils/securityUtils');

diabetesTypeRouter.use(checkToken);
diabetesTypeRouter.use(isAdmin);

diabetesTypeRouter
    .get('/', DiabetesTypeController.getAllTypes)
    .post('/', DiabetesTypeController.createNewType)
    .get('/:id', DiabetesTypeController.getTypeById)
    .put('/:id', express.json(), DiabetesTypeController.updateTypeById)
    .delete('/:id', express.json(), DiabetesTypeController.deleteTypeById);

module.exports = diabetesTypeRouter;
