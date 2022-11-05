const Exception = require('./exception');

class RouteApiException extends Exception {

  constructor(message, extraValues = {}) {
    super('RouteApiError', message, extraValues);
  }

}

module.exports = RouteApiException;