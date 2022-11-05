
const RouteApi = require('./route_api');
const RouteGroupApi = require('./route_group_api');
const RouteSocket = require('./route_socket');

class Routes {
  
  appId = '';
  customUrl = '';
  routes = [];
  groups = [];

  constructor(appId, customUrl = '') {
    this.customUrl = customUrl;
    this.appId = appId;
  }

  createRoute(type) {
    var route = null;

    if (type == 'socket') {
      route = new RouteSocket(this.appId);
    } else {
      route = new RouteApi(this.appId, this.customUrl);
    }

    this.routes.push(route);
    return route;
  }

  createGroup(groupUrl, addCustom = true) {
    if (addCustom) groupUrl = `${this.customUrl}${groupUrl}`;
    var _group = new RouteGroupApi(groupUrl, this.appId);
    this.groups.push(_group);
    return _group;
  }

  middlewaredGroup(middlewareName) {
    return this.createGroup(this.customUrl, false).middleware(middlewareName);
  }

  createApiRoute() {
    return this.createRoute('api');
  }

  createSocketRoute(eventName, func) {
    return this.createRoute('socket').event(eventName).func(func);
  }

  store() {
    this.setupRoutes();
    this.routes.forEach(route => {
      route.store();
    });
    this.groups.forEach(group => {
      group.store();
    });
  }
  
}

module.exports = Routes;