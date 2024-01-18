const MissingParamError = require('../helpers/errors/missing-param-error');
const UnauthorizedError = require('../helpers/errors/unauthorized-error');
const LoginRouter = require('./login-router');

const makeSut = () => {
  class AuthUseCaseSpy {
    auth(email, password) {
      this.email = email;
      this.password = password;
    }
  }

  const authUseCaseSpy = new AuthUseCaseSpy();
  const sut = new LoginRouter(authUseCaseSpy);

  return {
    authUseCaseSpy,
    sut,
  };
};

describe('Login Router', () => {
  test('should return 400 if email is not passed', () => {
    const { sut } = makeSut();
    const httpRequest = { body: { password: 'any_password' } };
    const httpResponse = sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  });

  test('should return 400 if password is not passed', () => {
    const { sut } = makeSut();
    const httpRequest = { body: { email: 'any_email' } };
    const httpResponse = sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
  });

  test('should return 500 if httpRequest is not passed', () => {
    const { sut } = makeSut();
    const httpResponse = sut.route();

    expect(httpResponse.statusCode).toBe(500);
  });

  test('should return 500 if httpRequest has no body', () => {
    const { sut } = makeSut();
    const httpResponse = sut.route({});

    expect(httpResponse.statusCode).toBe(500);
  });

  test('should return 500 if AuthUseCase is not passed', () => {
    const sut = new LoginRouter();
    const httpRequest = { body: { email: 'any_email', password: 'any_password' } };
    const httpResponse = sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
  });

  test('should return 500 if AuthUseCase has no auth method', () => {
    const sut = new LoginRouter({});
    const httpRequest = { body: { email: 'any_email', password: 'any_password' } };
    const httpResponse = sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
  });

  test('should call AuthUseCase with correct params', () => {
    const { authUseCaseSpy, sut } = makeSut();
    const httpRequest = { body: { email: 'any_email', password: 'any_password' } };

    sut.route(httpRequest);

    expect(authUseCaseSpy.email).toBe(httpRequest.body.email);
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password);
  });

  test('should return 401 when invalid credentials are passed', () => {
    const { sut } = makeSut();
    const httpRequest = { body: { email: 'invalid_email', password: 'invalid_password' } };
    const httpResponse = sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(401);
    expect(httpResponse.body).toEqual(new UnauthorizedError());
  });
});
