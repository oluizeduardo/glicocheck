const crypto = require('crypto');

/**
 * CryptoUtil.
 */
class CryptoUtil {
  /**
     * Creates a new hexadecimal random token.
     * @return {string} A new token.
     */
  static createRandomToken = () => {
    return crypto.randomBytes(20).toString('hex');
  };
}

module.exports = CryptoUtil;
