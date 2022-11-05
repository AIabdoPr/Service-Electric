const Exception = require('./exception');

class AuthException extends Exception {

  constructor(message, extraValues = {}) {
    super('AuthError', message, extraValues);
  }

}

module.exports = AuthException;