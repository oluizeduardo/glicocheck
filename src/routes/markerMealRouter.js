/* eslint-disable new-cap */
/* eslint-disable max-len */
const express = require('express');
const markerMealRouter = express.Router();
const MarkerMealController = require('../controllers/markerMealController');
const {checkToken} = require('../utils/securityUtils');
const {isAdminUser} = require('../utils/role');

markerMealRouter.use(checkToken);

markerMealRouter
    .post('/', isAdminUser, express.json(), MarkerMealController.createNewMarkerMeal)
    .get('/', MarkerMealController.getAllMarkerMeals)
    .get('/:id', MarkerMealController.getMarkerMealById)
    .put('/:id', isAdminUser, express.json(), MarkerMealController.updateMarkerMealById)
    .delete('/:id', isAdminUser, MarkerMealController.deleteMarkerMealById);

module.exports = markerMealRouter;
