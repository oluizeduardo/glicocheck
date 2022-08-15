const express = require('express');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 
const securityRouter = express.Router ();
const Messages = require('../messages');

const TOKEN_EXPIRING_TIME = '30m'

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


// REGISTER A NEW USER.
securityRouter.post('/register', express.json(), function (req, res) {
    knex('users')
        .insert({
            name: req.body.name,
            email: req.body.email,
            login: req.body.login,
            password: bcrypt.hashSync(req.body.password, 8),
            role_id: req.body.role_id
        }, 
        ['id'])
    .then(users => {
        let user = users[0];
        res.status(201).json({user});
    })
    .catch(err => res.status(500)
    .json({
        message: Messages.ERROR_CREATE_USER, 
        error: err.message
    }))
});


// LOGIN.
securityRouter.post('/login', function (req, res) {    
    knex
    .select('*').from('users')
    .where( { login: req.body.login })
    .then( users => {
        if(users.length){
            let user = users[0];
            let isValidPassword = bcrypt.compareSync (req.body.password, user.password);
            
            if (isValidPassword) {
                var tokenJWT = createTokenJWT(user);
                res.set('Authorization', tokenJWT);
                res.status(201).json ({
                    id: user.id,
                    login: user.login,
                    email: user.email,
                    role_id: user.role_id
                })                    
                return
            }
        }
        res.status(403).json({ message: Messages.WRONG_CREDENTIALS })
    })
    .catch (err => {
        res.status(500).json({
            message: Messages.ERROR_CHECKING_CREDENTIALS,
            error: err.message 
        })
    })
});


function createTokenJWT(user){
    return signToken(user.id);
}

function signToken(id){
    const payload = {
        id: id
    }
    const expires = {
        expiresIn: TOKEN_EXPIRING_TIME
    }
    const secret_key = process.env.SECRET_KEY;
    const token = jwt.sign(payload, secret_key, expires);
    return token;
}

module.exports = securityRouter;