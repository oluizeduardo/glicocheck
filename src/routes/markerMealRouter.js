const express = require('express')
const markerMealRouter = express.Router();
const MarkerMealController = require('../controllers/markerMealController');
const { checkToken, isAdmin } = require('../utils/securityUtils');

markerMealRouter
    .post('/', checkToken, isAdmin, express.json(), MarkerMealController.createNewMarkerMeal)
    .get('/', checkToken, MarkerMealController.getAllMarkerMeals)
    .get('/:id', checkToken, MarkerMealController.getMarkerMealById)
    .put('/:id', checkToken, isAdmin, express.json(), MarkerMealController.updateMarkerMealById)
    .delete('/:id', checkToken, isAdmin, MarkerMealController.deleteMarkerMealById);

module.exports = markerMealRouter;