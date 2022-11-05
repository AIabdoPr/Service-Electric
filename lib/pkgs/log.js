const LogModel = require('../../services/models/log_model');

class Log {

  type;
  name;
  message;
  extraValues;
  _loged = false;

  constructor(type, name, message, extraValues = {}, autoMigrate = true) {
    this.type = type;
    this.name = name;
    this.message = message;
    this.extraValues = extraValues;
    if (autoMigrate) {
      this.migrateLog();
    }
  }

  static log(name, message, extraValues = {}, autoMigrate = true) {
    return new Log('LOG', name, message, extraValues, autoMigrate);
  }

  static info(name, message, extraValues = {}, autoMigrate = true) {
    return new Log('INFO', name, message, extraValues, autoMigrate);
  }

  static error(name, message, extraValues = {}, autoMigrate = true) {
    return new Log('ERROR', name, message, extraValues, autoMigrate);
  }
  static warninig(name, message, extraValues = {}, autoMigrate = true) {
    return new Log('WARNING', name, message, extraValues, autoMigrate);
  }

  async migrateLog() {
    if (!this._loged) {
      var log = await new LogModel().create({
        type: this.type,
        name: this.name,
        message: this.message,
        extra_values: JSON.stringify(this.extraValues),
      });
      if (log) {
        this._loged = true;
      }
    }
  }

}

module.exports = Log;