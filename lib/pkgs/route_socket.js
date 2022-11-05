const Environment = require('../../src/environment');
const RouteApiException = require('./hundler/route_api_exception');

class RouteSocket {

  appId = '';
  eventName;
  eventFunc;

  constructor(appId) {
    this.appId = appId;
  }

  event(eventName) {
    this.eventName = eventName;
    return this;
  }

  func(eventFunc) {
    this.eventFunc = eventFunc;
    return this;
  }

  store() {
    if (!this.eventFunc) 
      throw new RouteApiException('The function required');
    if (!this.eventName) 
      throw new RouteApiException('The event name required');
    if (Environment.socketEvents[this.appId] == undefined) Environment.socketEvents[this.appId] = [];
    Environment.socketEvents[this.appId].push({
      event: this.eventName,
      func: this.eventFunc,
    });
  }

}

module.exports = RouteSocket;