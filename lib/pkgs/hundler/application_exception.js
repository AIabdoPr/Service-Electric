const Exception = require('./exception');

class ApplicationException extends Exception {

  constructor(message, extraValues = {}) {
    super('ApplicationError', message, extraValues);
  }

}

module.exports = ApplicationException;