/* eslint-disable new-cap */
/* eslint-disable max-len */
const express = require('express');
const systemHealthCheckRouter = express.Router();
const SystemHealthCheckController = require('../controllers/systemHealthCheckController');

systemHealthCheckRouter.get('/', SystemHealthCheckController.ping);

module.exports = systemHealthCheckRouter;
