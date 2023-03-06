const jwt = require('jsonwebtoken');

class WebToken{

    static getUserIdFromWebToken = (token) => {
        token = token.split(' ')[1];
        return jwt.verify(token, process.env.SECRET_KEY).id;
    }
}

module.exports = WebToken;