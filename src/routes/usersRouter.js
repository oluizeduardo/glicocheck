const express = require('express')
const jwt = require('jsonwebtoken');
const usersRouter = express.Router ();
const Messages = require('../utils/messages');
const database = require('../db/dbconfig.js');
const UserController = require('../controllers/userController');


// Authenticate password
let checkToken = (req, res, next) => {
    let authToken = req.headers['authorization'];
    if (!authToken) {        
        res.status(401).json({ message: Messages.TOKEN_REQUIRED});
        return;
    }
    else {
        let token = authToken.split(' ')[1];
        req.token = token;
    }

    jwt.verify(req.token, process.env.SECRET_KEY, (err, decodeToken) => {
        if (err) {
            if(err.name === 'TokenExpiredError'){
                res.status(401).json({ message: Messages.TOKEN_EXPIRED, expiredIn: err.expiredAt});
                return
            }
            res.status(401).json({ message: Messages.REFUSED_ACCESS });
            return

        }
        req.userId = decodeToken.id
        next()
    })
};

// CHECK USER ROLE.
let isAdmin = (req, res, next) => {
    database
        .select ('*').from ('users').where({ id: req.userId })
        .then ((users) => {
            if (users.length) {
                let user = users[0]
                let role = user.role_id;
                
                if (role === 1) {
                    next()
                    return
                }
                else {
                    res.status(403).json({ message: Messages.ROLE_ADMIN_REQUIRED })
                    return
                }
            }
        })
        .catch (err => {
            res.status(500).json({ 
              message: 'Error trying to check user. - ' + err.message })
        })
};

usersRouter
    .get('/', checkToken, isAdmin, UserController.getAllUsers)
    .get('/:id', checkToken, isAdmin, UserController.getUserById)
    .put('/:id', checkToken, isAdmin, express.json(), UserController.updateUserById)
    .delete('/:id', checkToken, isAdmin, UserController.deleteUserById);

module.exports = usersRouter