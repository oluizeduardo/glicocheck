const express = require('express');
// eslint-disable-next-line new-cap
const usersRouter = express.Router();
const UserController = require('../controllers/userController');
const {checkToken, isAdmin} = require('../utils/securityUtils');

usersRouter.use(checkToken);
usersRouter.use(isAdmin);

usersRouter
    .get('/', UserController.getAllUsers)
    .get('/:id', UserController.getUserById)
    .put('/:id', express.json(), UserController.updateUserById)
    .delete('/:id', express.json(), UserController.deleteUserById);

module.exports = usersRouter;
