/* eslint-disable max-len */
const express = require('express');
// eslint-disable-next-line new-cap
const healthInfoRouter = express.Router();
const HealthInfoController = require('../controllers/healthInfoController');
const {checkToken, isAdmin} = require('../utils/securityUtils');

healthInfoRouter.use(checkToken);
healthInfoRouter.use(isAdmin);

healthInfoRouter
    .get('/', HealthInfoController.getAll)
    .post('/', HealthInfoController.addNew)
    .get('/user/:id', HealthInfoController.getByUserId)
    .put('/user/:id', express.json(), HealthInfoController.updateByUserId)
    .delete('/user/:id', express.json(), HealthInfoController.deleteByUserId);

module.exports = healthInfoRouter;
