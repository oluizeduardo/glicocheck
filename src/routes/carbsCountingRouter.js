/* eslint-disable max-len */
const express = require('express');
// eslint-disable-next-line new-cap
const carbsCountingRouter = express.Router();
const CarbsCountingController = require('../controllers/carbsCountingController');
const {checkToken} = require('../utils/securityUtils');

carbsCountingRouter.use(checkToken);

carbsCountingRouter.get('/:food', CarbsCountingController.calculatesTotalCarbohydrate);

module.exports = carbsCountingRouter;
