const express = require('express');
const systemConfigurationRouter = express.Router();
const {checkToken, isAdmin} = require('../utils/securityUtils');
const SystemConfigurationController = require('../controllers/systemConfigurationController');

systemConfigurationRouter
    .post('/', checkToken, isAdmin, express.json(), SystemConfigurationController.addSystemConfiguration)
    .get('/', checkToken, isAdmin, express.json(), SystemConfigurationController.getAllSystemConfiguration)
    .get('/:userId', checkToken, isAdmin, express.json(), SystemConfigurationController.getConfigurationByUserId);

module.exports = systemConfigurationRouter;
