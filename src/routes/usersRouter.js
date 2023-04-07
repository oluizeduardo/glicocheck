const express = require('express');
const usersRouter = express.Router();
const UserController = require('../controllers/userController');
const {checkToken, isAdmin} = require('../utils/securityUtils');

usersRouter
    .get('/', checkToken, isAdmin, UserController.getAllUsers)
    .get('/:id', checkToken, isAdmin, UserController.getUserById)
    .put('/:id', checkToken, isAdmin, express.json(), UserController.updateUserById)
    .delete('/:id', checkToken, isAdmin, express.json(), UserController.deleteUserById);

module.exports = usersRouter;
