const express = require('express');
const carbsCountingRouter = express.Router();
const CarbsCountingController = require('../controllers/carbsCountingController');
const {checkToken} = require('../utils/securityUtils');

carbsCountingRouter.get('/:food', checkToken, CarbsCountingController.calculatesTotalCarbohydrate);

module.exports = carbsCountingRouter;
