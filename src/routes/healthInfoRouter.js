/* eslint-disable new-cap */
/* eslint-disable max-len */
const express = require('express');
const healthInfoRouter = express.Router();
const HealthInfoController = require('../controllers/healthInfoController');
const {checkToken} = require('../utils/securityUtils');
const {isRegularUser} = require('../utils/role');

healthInfoRouter.use(checkToken);
healthInfoRouter.use(isRegularUser);

healthInfoRouter
    .get('/', HealthInfoController.getAll)
    .post('/', HealthInfoController.addNew)
    .get('/user/:id', HealthInfoController.getByUserId)
    .put('/user/:id', express.json(), HealthInfoController.updateByUserId)
    .delete('/user/:id', express.json(), HealthInfoController.deleteByUserId);

module.exports = healthInfoRouter;
