const InvalidParamError = require('../helpers/errors/invalid-param-error');
const MissingParamError = require('../helpers/errors/missing-param-error');
const ServerError = require('../helpers/errors/server-error');
const UnauthorizedError = require('../helpers/errors/unauthorized-error');
const LoginRouter = require('./login-router');

const makeSut = () => {
  const authUseCaseSpy = makeAuthUseCaseSpy();
  authUseCaseSpy.accessToken = 'valid_token';

  const emailValidatorSpy = makeEmailValidatorSpy();
  const sut = new LoginRouter(authUseCaseSpy, emailValidatorSpy);

  return {
    authUseCaseSpy,
    emailValidatorSpy,
    sut,
  };
};

const makeAuthUseCaseSpy = () => {
  class AuthUseCaseSpy {
    async auth(email, password) {
      this.email = email;
      this.password = password;

      return this.accessToken;
    }
  }

  return new AuthUseCaseSpy();
};

const makeAuthUseCaseWithErrorSpy = () => {
  class AuthUseCaseWithErrorSpy {
    async auth(email, password) {
      this.email = email;
      this.password = password;

      throw new Error();
    }
  }

  return new AuthUseCaseWithErrorSpy();
};

const makeEmailValidatorSpy = () => {
  class EmailValidatorSpy {
    // eslint-disable-next-line no-unused-vars
    isValid(email) {
      return this.isValidEmail;
    }
  }

  const emailValidatorSpy = new EmailValidatorSpy();
  emailValidatorSpy.isValidEmail = true;

  return emailValidatorSpy;
};

const makeEmailValidatorWithErrorSpy = () => {
  class EmailValidatorSpy {
    // eslint-disable-next-line no-unused-vars
    isValid(email) {
      throw new Error();
    }
  }

  return new EmailValidatorSpy();
};

describe('Login Router', () => {
  test('should return 400 if email is not passed', async () => {
    const { sut } = makeSut();
    const httpRequest = { body: { password: 'any_password' } };
    const { statusCode, body } = await sut.route(httpRequest);

    expect(statusCode).toBe(400);
    expect(body).toEqual(new MissingParamError('email'));
  });

  test('should return 400 if an invalid email is passed', async () => {
    const { emailValidatorSpy, sut } = makeSut();
    const httpRequest = { body: { email: 'any_email' } };

    emailValidatorSpy.isValidEmail = false;

    const { statusCode, body } = await sut.route(httpRequest);

    expect(statusCode).toBe(400);
    expect(body).toEqual(new InvalidParamError('email'));
  });

  test('should return 400 if password is not passed', async () => {
    const { sut } = makeSut();
    const httpRequest = { body: { email: 'any_email' } };
    const { statusCode, body } = await sut.route(httpRequest);

    expect(statusCode).toBe(400);
    expect(body).toEqual(new MissingParamError('password'));
  });

  test('should return 500 if httpRequest is not passed', async () => {
    const { sut } = makeSut();
    const { statusCode, body } = await sut.route();

    expect(statusCode).toBe(500);
    expect(body).toEqual(new ServerError());
  });

  test('should return 500 if httpRequest has no body', async () => {
    const { sut } = makeSut();
    const { statusCode, body } = await sut.route({});

    expect(statusCode).toBe(500);
    expect(body).toEqual(new ServerError());
  });

  test('should return 500 if AuthUseCase is not passed', async () => {
    const sut = new LoginRouter();
    const httpRequest = { body: { email: 'any_email', password: 'any_password' } };
    const { statusCode, body } = await sut.route(httpRequest);

    expect(statusCode).toBe(500);
    expect(body).toEqual(new ServerError());
  });

  test('should return 500 if AuthUseCase has no auth method', async () => {
    const sut = new LoginRouter({});
    const httpRequest = { body: { email: 'any_email', password: 'any_password' } };
    const { statusCode, body } = await sut.route(httpRequest);

    expect(statusCode).toBe(500);
    expect(body).toEqual(new ServerError());
  });

  test('should return 500 if AuthUseCase throw error', async () => {
    const authUseCaseWithError = makeAuthUseCaseWithErrorSpy();
    const sut = new LoginRouter(authUseCaseWithError);
    const httpRequest = { body: { email: 'any_email', password: 'any_password' } };
    const { statusCode, body } = await sut.route(httpRequest);

    expect(statusCode).toBe(500);
    expect(body).toEqual(new ServerError());
  });

  test('should return 500 if EmailValidator is not passed', async () => {
    const authUseCaseSpy = makeAuthUseCaseSpy();
    const sut = new LoginRouter(authUseCaseSpy);
    const httpRequest = { body: { email: 'any_email', password: 'any_password' } };
    const { statusCode, body } = await sut.route(httpRequest);

    expect(statusCode).toBe(500);
    expect(body).toEqual(new ServerError());
  });

  test('should return 500 if EmailValidator has no isValid method', async () => {
    const authUseCaseSpy = makeAuthUseCaseSpy();
    const sut = new LoginRouter(authUseCaseSpy, {});
    const httpRequest = { body: { email: 'any_email', password: 'any_password' } };
    const { statusCode, body } = await sut.route(httpRequest);

    expect(statusCode).toBe(500);
    expect(body).toEqual(new ServerError());
  });

  test('should return 500 if EmailValidator throw error', async () => {
    const authUseCaseSpy = makeAuthUseCaseSpy();
    const emailValidatorWithErrorSpy = makeEmailValidatorWithErrorSpy();
    const sut = new LoginRouter(authUseCaseSpy, emailValidatorWithErrorSpy);
    const httpRequest = { body: { email: 'any_email', password: 'any_password' } };
    const { statusCode, body } = await sut.route(httpRequest);

    expect(statusCode).toBe(500);
    expect(body).toEqual(new ServerError());
  });

  test('should call AuthUseCase with correct params', async () => {
    const { authUseCaseSpy, sut } = makeSut();
    const httpRequest = { body: { email: 'any_email', password: 'any_password' } };

    await sut.route(httpRequest);

    expect(authUseCaseSpy.email).toBe(httpRequest.body.email);
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password);
  });

  test('should return 401 when invalid credentials are passed', async () => {
    const { authUseCaseSpy, sut } = makeSut();
    authUseCaseSpy.accessToken = null;

    const httpRequest = { body: { email: 'invalid_email', password: 'invalid_password' } };
    const { statusCode, body } = await sut.route(httpRequest);

    expect(statusCode).toBe(401);
    expect(body).toEqual(new UnauthorizedError());
  });

  test('should return 200 when valid credentials are passed', async () => {
    const { authUseCaseSpy, sut } = makeSut();
    const httpRequest = { body: { email: 'valid_email', password: 'valid_password' } };
    const { statusCode, body } = await sut.route(httpRequest);

    expect(statusCode).toBe(200);
    expect(body.accessToken).toBe(authUseCaseSpy.accessToken);
  });
});
