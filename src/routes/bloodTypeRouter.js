/* eslint-disable new-cap */
/* eslint-disable max-len */
const express = require('express');
const bloodTypeRouter = express.Router();
const BloodTypeController = require('../controllers/bloodTypeController');
const {checkToken} = require('../utils/securityUtils');
const {isAdminUser} = require('../utils/role');

bloodTypeRouter.use(checkToken);

bloodTypeRouter
    .get('/', BloodTypeController.getAllTypes)
    .post('/', isAdminUser, BloodTypeController.createNewType)
    .get('/:id', BloodTypeController.getTypeById)
    .put('/:id', isAdminUser, express.json(), BloodTypeController.updateTypeById)
    .delete('/:id', isAdminUser, express.json(), BloodTypeController.deleteTypeById);

module.exports = bloodTypeRouter;
