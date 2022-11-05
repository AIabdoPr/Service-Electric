const Consts = require("./consts");

class Environment {
  static app = null;
  static server = null;
  static database = null;
  static databaseConnection = null;
  static sockets = {};
  static databaseListener = null;
  static webViewsPaths = [];
  static routes = [];
  static storages = {
    general: `${Consts.APP_PATH}/services/general_storage`
  };
  static databaseListenersFuncs = {
    insert: {},
    update: {},
    delete: {},
  };

  static middlewares = {};

  static socketClients = {};
  static socketEvents = {};

  static addViewPath(path) {
    if (this.webViewsPaths.indexOf(path) == -1) {
      this.webViewsPaths.push(path);
      this.app.set('views', this.webViewsPaths);
    }
  }

}

module.exports = Environment;