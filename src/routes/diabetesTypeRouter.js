/* eslint-disable new-cap */
/* eslint-disable max-len */
const express = require('express');
const diabetesTypeRouter = express.Router();
const DiabetesTypeController = require('../controllers/diabetesTypeController');
const {checkToken} = require('../utils/securityUtils');
const {isAdminUser} = require('../utils/role');

diabetesTypeRouter.use(checkToken);

diabetesTypeRouter
    .get('/', DiabetesTypeController.getAllTypes)
    .post('/', isAdminUser, DiabetesTypeController.createNewType)
    .get('/:id', DiabetesTypeController.getTypeById)
    .put('/:id', isAdminUser, express.json(), DiabetesTypeController.updateTypeById)
    .delete('/:id', isAdminUser, express.json(), DiabetesTypeController.deleteTypeById);

module.exports = diabetesTypeRouter;
