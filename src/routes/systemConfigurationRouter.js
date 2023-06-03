const express = require('express');
const systemConfigurationRouter = express.Router();
const {checkToken, isAdmin} = require('../utils/securityUtils');
const SystemConfigurationController =
    require('../controllers/systemConfigurationController');

systemConfigurationRouter.use(checkToken);
systemConfigurationRouter.use(isAdmin);
systemConfigurationRouter.use(express.json());

systemConfigurationRouter
    .post('/', SystemConfigurationController.addSystemConfiguration)
    .get('/', SystemConfigurationController.getAllSystemConfiguration)
    .get('/user/:userId', SystemConfigurationController.getByUserId)
    .put('/user/:userId', SystemConfigurationController.updateByUserId)
    .delete('/user/:userId', SystemConfigurationController.deleteByUserId);

module.exports = systemConfigurationRouter;
