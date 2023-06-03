const express = require('express');
// eslint-disable-next-line new-cap
const genderRouter = express.Router();
const GenderController = require('../controllers/genderController');
const {checkToken, isAdmin} = require('../utils/securityUtils');

genderRouter.use(checkToken);
genderRouter.use(isAdmin);

genderRouter
    .get('/', GenderController.getAllGenders)
    .post('/', GenderController.createNewGender)
    .get('/:id', GenderController.getGenderById)
    .put('/:id', express.json(), GenderController.updateGenderById)
    .delete('/:id', express.json(), GenderController.deleteGenderById);

module.exports = genderRouter;
