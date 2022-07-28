const express = require('express');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 
const securityRouter = express.Router ();

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
    .catch(err => res.status(500).json({message: 'Error trying to insert a new user. - ' + err.message}))
});


// LOGIN.
securityRouter.post('/login', function (req, res) {
    knex
        .select('*').from('users')
        .where( { login: req.body.login })
        .then( users => {
            if(users.length){
                let user = users[0];
                let checkPassword = bcrypt.compareSync (req.body.password, user.password);
                if (checkPassword) {
                    var tokenJWT = jwt.sign({ id: user.id },
                    process.env.SECRET_KEY, {
                        expiresIn: 3600
                    })
                    res.status(200).json ({
                        id: user.id,
                        login: user.login,
                        name: user.name,
                        role: user.role_id,
                        token: tokenJWT
                    })
                    return
                }
            }
        res.status(403).json({ message: 'Wrong credentials.' })
    })
    .catch (err => {
        res.status(500).json({
        message: 'Error trying to check login credentials. - ' + err.message })
    })
});


module.exports = securityRouter;