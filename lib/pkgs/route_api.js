const Environment = require('../../src/environment');
const MiddlewareException = require('./hundler/middleware_exception');
const RouteApiException = require('./hundler/route_api_exception');
const Request = require('./request');
const Response = require('./response');

class RouteApi {

  type;
  customUrl;
  routeUrl;
  appId;
  routeFunc;
  routeName = null;
  _middleware = null;
  _group = null;

  constructor(appId, customUrl = '') {
    this.customUrl = customUrl;
    this.appId = appId;
  }

  setType(type, routeUrl) {
    this.type = type;
    this.routeUrl = `${this.customUrl}${routeUrl}`;
    return this;
  }

  post(routeUrl) {
    return this.setType('post', routeUrl);
  }

  get(routeUrl) {
    return this.setType('get', routeUrl);
  }

  delete(routeUrl) {
    return this.setType('delete', routeUrl);
  }

  put(routeUrl) {
    return this.setType('put', routeUrl);
  }

  name(name) {
    this.routeName = name;
    return this;
  }

  func(routeFunc) {
    this.routeFunc = routeFunc;
    return this;
  }

  middleware(middlewareName) {
    var middlewareKey = middlewareName.split('.')[0];
    var middlewareFunc = middlewareName.split('.')[1];
    if (!Environment.middlewares[this.appId] ||
      !Environment.middlewares[this.appId][middlewareKey] ||
      !Environment.middlewares[this.appId][middlewareKey][middlewareFunc])
      throw new MiddlewareException(`Undefined middleware with this name (${middlewareKey}) func(${middlewareFunc})`);
    this._middleware = Environment.middlewares[this.appId][middlewareKey][middlewareFunc];
    return this;
  }

  async verifyAndNext(request, response) {
    request = new Request(request)
    response = new Response(request, response);
    if (this._middleware) {
      var verify = await this._middleware(request, response);
      if (verify.success) {
        return this.routeFunc(request, response);
      } else {
        if (verify.redirectUrl) {
          return response.redirect(301, verify.redirectUrl);
        } else {
          return response.json(verify);
        }
      }
    } else {
      this.routeFunc(request, response);
    }
  }

  store() {
    if (!this.routeFunc) 
      throw new RouteApiException('The function required');

    if (this.type == 'get') {
      Environment.app.get(this.routeUrl, (request, response) => {
        this.verifyAndNext(request, response);
      });
    } else if (this.type == 'post') {
      Environment.app.post(this.routeUrl, (request, response) => {
        this.verifyAndNext(request, response);
      });
    } else if (this.type == 'delete') {
      Environment.app.delete(this.routeUrl, (request, response) => {
        this.verifyAndNext(request, response);
      });
    } else if (this.type == 'put') {
      Environment.app.put(this.routeUrl, (request, response) => {
        this.verifyAndNext(request, response);
      });
    }
  }

}

module.exports = RouteApi