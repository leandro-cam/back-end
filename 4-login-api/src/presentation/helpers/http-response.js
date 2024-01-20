const ServerError = require('./errors/server-error');
const UnauthorizedError = require('./errors/unauthorized-error');

module.exports = class HttpResponse {
  static badRequest(error) {
    return {
      statusCode: 400,
      body: error,
    };
  }

  static unauthorized() {
    return {
      statusCode: 401,
      body: new UnauthorizedError(),
    };
  }

  static serverError() {
    return {
      statusCode: 500,
      body: new ServerError(),
    };
  }

  static ok(body) {
    return {
      statusCode: 200,
      body,
    };
  }
};
