const Exception = require('./exception');

class ListenerException extends Exception {

  constructor(message, extraValues = {}) {
    super('ListenerError', message, extraValues);
  }

}

module.exports = ListenerException;