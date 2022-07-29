const express = require('express')
const jwt = require('jsonwebtoken');
const usersRouter = express.Router ();
const Messages = require('../messages');

// CONFIG TO CONNECT WITH THE DATABASE.
const knex = require ('knex') ({
    client: 'pg',// POSTGRESQL
    connection: {
        connectionString: process.env.DATABASE_URL,// Look up at .env file.
        ssl: {
            rejectUnauthorized: false
        },
    }
})


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
    knex
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


// READ ALL USERS.
usersRouter.get('/', checkToken, isAdmin, function (req, res) {
    knex('users')
        .join('role', 'users.role_id', 'role.id')
        .select('users.id', 'users.name', 'users.email', 'users.login', 'role.description as role')
        .then(users => {
            if(users.length){
                res.status(200).json(users);
            }else{
                res.status(200).json({message: Messages.MESSAGE_NOTHING_FOUND})
            }
        });
})


// READ A USER BASED ON HIS ID.
usersRouter.get('/:id', checkToken, isAdmin, function (req, res) {
    let id = Number.parseInt(req.params.id);
    knex('users')
        .where('users.id', id)
        .join('role', 'users.role_id', 'role.id')
        .select('users.id', 'users.name', 'users.email', 'users.login', 'role.description as role')
        .then(users => {
            if(users.length){
                res.status(200).json(users);
            }else{
                res.status(404).json({message: Messages.MESSAGE_NOTHING_FOUND})
            }
        });
})


// UPDATE A USER BASED ON HIS ID.
usersRouter.put('/:id', checkToken, isAdmin, express.json(), function (req, res) {
    let id = Number.parseInt(req.params.id);
   
    let response = knex('users')
        .where('id', id)
        .update({
            name: req.body.name,
            email: req.body.email,
            login: req.body.login,
            password: req.body.password,
            role_id: req.body.role_id
        },
        ['id', 'name','email','login', 'role_id']);

    response.then (users => {            
            if(users.length){
                let user = users[0]
                res.status(201).json({user})
            }else{
                res.status(404).json({message: Messages.MESSAGE_NOTHING_FOUND})
            }
        })
        .catch (err => res.status(500)
        .json ({ message: `Error trying to update user. ERROR: ${err.message}`}))
})


// DELETE A USER BASED ON HIS ID.
usersRouter.delete('/:id', checkToken, isAdmin, function (req, res) {
    let id = Number.parseInt(req.params.id)

    if (id > 0) {
        knex('users')
          .where('id', id)
          .del()
          .then(res.status(200).json({message: `User ${id} has been deleted!`}))
          .catch (err => res.status(500).json ({ message: Messages.ERROR_DELETE_USER + `ERROR: ${err.message}`}))
    } else {
        res.status(404).json({
            message: Messages.MESSAGE_NOTHING_FOUND
        })
    }        
})

module.exports = usersRouter