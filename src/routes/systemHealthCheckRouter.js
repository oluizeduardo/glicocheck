/* eslint-disable max-len */
const express = require('express');
// eslint-disable-next-line new-cap
const systemHealthCheckRouter = express.Router();
const SystemHealthCheckController = require('../controllers/systemHealthCheckController');

systemHealthCheckRouter.get('/', SystemHealthCheckController.ping);

module.exports = systemHealthCheckRouter;
