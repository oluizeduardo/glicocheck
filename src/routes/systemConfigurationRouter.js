const express = require('express');
const systemConfigurationRouter = express.Router();
const {checkToken, isAdmin} = require('../utils/securityUtils');
const SystemConfigurationController = require('../controllers/systemConfigurationController');

systemConfigurationRouter.use(checkToken);
systemConfigurationRouter.use(isAdmin);

systemConfigurationRouter
    .post('/', express.json(), SystemConfigurationController.addSystemConfiguration)
    .get('/', express.json(), SystemConfigurationController.getAllSystemConfiguration)
    .get('/user/:userId', express.json(), SystemConfigurationController.getConfigurationByUserId)
    .put('/user/:userId', express.json(), SystemConfigurationController.updateConfigurationByUserId)
    .delete('/user/:userId', express.json(), SystemConfigurationController.deleteConfigurationByUserId);

module.exports = systemConfigurationRouter;
