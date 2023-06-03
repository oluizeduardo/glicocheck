const express = require('express');
const bloodTypeRouter = express.Router();
const BloodTypeController = require('../controllers/bloodTypeController');
const {checkToken, isAdmin} = require('../utils/securityUtils');

bloodTypeRouter.use(checkToken);
bloodTypeRouter.use(isAdmin);

bloodTypeRouter
    .get('/', BloodTypeController.getAllTypes)
    .post('/', BloodTypeController.createNewType)
    .get('/:id', BloodTypeController.getTypeById)
    .put('/:id', express.json(), BloodTypeController.updateTypeById)
    .delete('/:id', express.json(), BloodTypeController.deleteTypeById);

module.exports = bloodTypeRouter;
