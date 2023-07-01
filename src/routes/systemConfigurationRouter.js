/* eslint-disable new-cap */
/* eslint-disable max-len */
const express = require('express');
const systemConfigurationRouter = express.Router();
const {checkToken} = require('../utils/securityUtils');
const {isRegularUser} = require('../utils/role');
const SystemConfigurationController = require('../controllers/systemConfigurationController');

systemConfigurationRouter.use(express.json());
systemConfigurationRouter.use(checkToken);
systemConfigurationRouter.use(isRegularUser);

systemConfigurationRouter
    .post('/', SystemConfigurationController.addSystemConfiguration)
    .get('/', SystemConfigurationController.getAllSystemConfiguration)
    .get('/user/:userId', SystemConfigurationController.getByUserId)
    .put('/user/:userId', SystemConfigurationController.updateByUserId)
    .delete('/user/:userId', SystemConfigurationController.deleteByUserId);

module.exports = systemConfigurationRouter;
