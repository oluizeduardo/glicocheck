const express = require('express');
const markerMealRouter = express.Router();
const MarkerMealController = require('../controllers/markerMealController');
const {checkToken, isAdmin} = require('../utils/securityUtils');

markerMealRouter.use(checkToken);
markerMealRouter.use(isAdmin);

markerMealRouter
    .post('/', express.json(), MarkerMealController.createNewMarkerMeal)
    .get('/', MarkerMealController.getAllMarkerMeals)
    .get('/:id', MarkerMealController.getMarkerMealById)
    .put('/:id', express.json(), MarkerMealController.updateMarkerMealById)
    .delete('/:id', MarkerMealController.deleteMarkerMealById);

module.exports = markerMealRouter;
