const Messages = require('../utils/messages');
const bcrypt = require('bcryptjs'); 
const database = require('../db/dbconfig.js');
const jwt = require('jsonwebtoken');

class SecurityController {

  static TOKEN_EXPIRING_TIME = '30m';

  // NEW USER
  static registerNewUser = async (req, res) => {     
    try {
      await database('users')
        .insert({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8),
            role_id: req.body.role_id
        }, 
        ['id'])
      .then(users => {
        let user_id = users[0];
        res.status(201).json({user_id});
      });
    } catch (err) {
      return res.status(500).json({
          message: Messages.ERROR_CREATE_USER, 
          error: err.message
      });
    }
  };

  // LOGIN
  static doLogin = async (req, res) => {
    await database
    .select('*').from('users')
    .where( { email: req.body.email })
    .then( users => 
    {
      if(users.length)
      {
        let user = users[0];
        let isValidPassword = bcrypt.compareSync (req.body.password, user.password);
        
        if (isValidPassword)
        {
          var tokenJWT = SecurityController.createTokenJWT(user);
          res.set('Authorization', tokenJWT);
          res.status(201).json ({
            user_id: user.id,
            accessToken: tokenJWT
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
  }

  static createTokenJWT(user){
    return SecurityController.signToken(user.id);
  }

  static signToken(id){
    const payload = {
        id: id
    }
    const expires = {
        expiresIn: SecurityController.TOKEN_EXPIRING_TIME
    }
    const secret_key = process.env.SECRET_KEY;
    const token = jwt.sign(payload, secret_key, expires);
    return token;
  }
}

module.exports = SecurityController