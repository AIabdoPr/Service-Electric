const Exception = require('./exception');

class ColumnMakerException extends Exception {

  constructor(message, extraValues = {}) {
    super('ColumnMakerError', message, extraValues);
  }

}

module.exports = ColumnMakerException;