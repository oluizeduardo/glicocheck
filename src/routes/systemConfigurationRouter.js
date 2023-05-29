const express = require('express');
const systemConfigurationRouter = express.Router();
const {checkToken, isAdmin} = require('../utils/securityUtils');
const SystemConfigurationController = require('../controllers/systemConfigurationController');

systemConfigurationRouter
    .post('/', checkToken, isAdmin, express.json(), SystemConfigurationController.addSystemConfiguration)
    .get('/', checkToken, isAdmin, express.json(), SystemConfigurationController.getAllSystemConfiguration)
    .get('/user/:userId', checkToken, isAdmin, express.json(), SystemConfigurationController.getConfigurationByUserId)
    .put('/user/:userId', checkToken, isAdmin, express.json(), SystemConfigurationController.updateConfigurationByUserId)
    .delete('/user/:userId', checkToken, isAdmin, express.json(), SystemConfigurationController.deleteConfigurationByUserId);

module.exports = systemConfigurationRouter;
