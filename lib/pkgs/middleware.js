const Environment = require('../../src/environment');
const MiddlewareException = require('./hundler/middleware_exception');

class Middleware {

  appId = '';
  key = null;
  verify = null;
  socketVerify = null;

  constructor(appId, key) {
    this.appId = appId;
    this.key = key;
  }

  store() {
    if (!this.key)
      throw new MiddlewareException('Middleware key is required');
    if (!this.verify)
      throw new MiddlewareException('Verify function is required');
    if (Environment.middlewares[this.appId] == undefined) Environment.middlewares[this.appId] = {};
    // Environment.middlewares[this.appId][this.key] = this.verify;
    Environment.middlewares[this.appId][this.key] = this;
    // if (this.socketVerify)
    //   Environment.middlewares[this.appId][`socket-${this.key}`] = this.socketVerify;
  }

}

module.exports = Middleware;