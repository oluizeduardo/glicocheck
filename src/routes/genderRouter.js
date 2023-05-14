const express = require('express');
const genderRouter = express.Router();
const GenderController = require('../controllers/genderController');
const {checkToken, isAdmin} = require('../utils/securityUtils');

genderRouter
    .get('/', checkToken, isAdmin, GenderController.getAllGenders)
    .post('/', checkToken, isAdmin, GenderController.createNewGender)
    .get('/:id', checkToken, isAdmin, GenderController.getGenderById)
    .put('/:id', checkToken, isAdmin, express.json(), GenderController.updateGenderById)
    .delete('/:id', checkToken, isAdmin, express.json(), GenderController.deleteGenderById);

module.exports = genderRouter;
