const MissingParamError = require('../helpers/errors/missing-param-error');
const LoginRouter = require('./login-router');

const makeSut = () => {
  return new LoginRouter();
};

describe('Login Router', () => {
  test('should return 400 if email is not passed', () => {
    const sut = makeSut();
    const httpRequest = { body: { password: 'any_password' } };
    const httpResponse = sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  });

  test('should return 400 if password is not passed', () => {
    const sut = makeSut();
    const httpRequest = { body: { email: 'any_email' } };
    const httpResponse = sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
  });

  test('should return 500 if httpRequest is not passed', () => {
    const sut = makeSut();
    const httpResponse = sut.route();

    expect(httpResponse.statusCode).toBe(500);
  });

  test('should return 500 if httpRequest has no body', () => {
    const sut = makeSut();
    const httpResponse = sut.route({});

    expect(httpResponse.statusCode).toBe(500);
  });
});
