/* eslint-disable new-cap */
/* eslint-disable max-len */
const express = require('express');
const genderRouter = express.Router();
const GenderController = require('../controllers/genderController');
const {checkToken} = require('../utils/securityUtils');
const {isAdminUser} = require('../utils/role');

genderRouter.use(checkToken);

genderRouter
    .get('/', GenderController.getAllGenders)
    .post('/', isAdminUser, GenderController.createNewGender)
    .get('/:id', GenderController.getGenderById)
    .put('/:id', isAdminUser, express.json(), GenderController.updateGenderById)
    .delete('/:id', isAdminUser, express.json(), GenderController.deleteGenderById);

module.exports = genderRouter;
