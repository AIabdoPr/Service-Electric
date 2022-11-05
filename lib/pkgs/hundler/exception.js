const Log = require('../log');

class Exception extends Error {

  extraValues;
  _loged = false;

  constructor(name, message, extraValues = {}, logError = true) {
    super(name, message);
    this.extraValues = extraValues;
    if (logError) this.logError();
  }

  logError() {
    if (!this._loged) {
      Log.error(this.name, this.message, this.extraValues);
    }
  }

}

module.exports = Exception;