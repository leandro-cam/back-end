const MissingParamError = require('./errors/missing-param-error');
const UnauthorizedError = require('./errors/unauthorized-error');

module.exports = class HttpResponse {
  static badRequest(paramName) {
    return {
      statusCode: 400,
      body: new MissingParamError(paramName),
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
    };
  }

  static ok(body) {
    return {
      statusCode: 200,
      body,
    };
  }
};
