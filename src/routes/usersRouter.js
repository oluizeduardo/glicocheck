/* eslint-disable new-cap */
const express = require('express');
const usersRouter = express.Router();
const UserController = require('../controllers/userController');
const {checkToken} = require('../utils/securityUtils');

usersRouter.use(checkToken);

usersRouter
    .get('/', UserController.getAllUsers)
    .get('/:id', UserController.getUserById)
    .put('/:id', express.json(), UserController.updateUserById)
    .delete('/:id', express.json(), UserController.deleteUserById);

module.exports = usersRouter;
