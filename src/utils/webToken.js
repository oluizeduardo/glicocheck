const jwt = require('jsonwebtoken');
/**
 * WebToken.
 */
class WebToken {
  /**
   * Gets the user id from a web token.
   * @param {string} token The JWT token where the id will be extracted from.
   * @return {number} The user id.
   */
  static getUserIdFromWebToken = (token) => {
    token = token.split(' ')[1];
    return jwt.verify(token, process.env.SECRET_KEY).id;
  };
}

module.exports = WebToken;
