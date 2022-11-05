const Exception = require('./exception');

class MiddlewareException extends Exception {

  constructor(message, extraValues = {}) {
    super('MiddlewareError', message, extraValues);
  }

}

module.exports = MiddlewareException;