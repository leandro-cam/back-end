const { MissingParamError } = require('../../utils/errors');

const AuthUseCase = require('./auth-usecase');

const makeLoadUserByEmailRepository = () => {
  class LoadUserByEmailRepositorySpy {
    async load(email) {
      this.email = email;
      return this.user;
    }
  }

  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy();
  loadUserByEmailRepositorySpy.user = { id: 'any_id', password: 'hashed_password' };
  return loadUserByEmailRepositorySpy;
};

const makeLoadUserByEmailRepositoryWithError = () => {
  class LoadUserByEmailRepositorySpy {
    async load() {
      throw new Error();
    }
  }

  return new LoadUserByEmailRepositorySpy();
};

const makeEncrypter = () => {
  class EncrypterSpy {
    async compare(password, hashedPassword) {
      this.password = password;
      this.hashedPassword = hashedPassword;
      return this.isValid;
    }
  }

  const encrypterSpy = new EncrypterSpy();
  encrypterSpy.isValid = true;
  return encrypterSpy;
};

const makeEncrypterWithError = () => {
  class EncrypterSpy {
    async compare() {
      throw new Error();
    }
  }

  return new EncrypterSpy();
};

const makeTokenGenerator = () => {
  class TokenGeneratorSpy {
    async generate(userId) {
      this.userId = userId;
      return this.accessToken;
    }
  }

  const tokenGeneratorSpy = new TokenGeneratorSpy();
  tokenGeneratorSpy.accessToken = 'any_token';
  return tokenGeneratorSpy;
};

const makeTokenGeneratorWithError = () => {
  class TokenGeneratorSpy {
    async generate(userId) {
      throw new Error();
    }
  }

  return new TokenGeneratorSpy();
};

const makeUpdateAccessTokenRepository = () => {
  class UpdateAccessTokenRepositorySpy {
    async update(userId, accessToken) {
      this.userId = userId;
      this.accessToken = accessToken;
    }
  }

  return new UpdateAccessTokenRepositorySpy();
};

const makeSut = () => {
  const encrypterSpy = makeEncrypter();
  const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository();
  const tokenGeneratorSpy = makeTokenGenerator();
  const updateAccessTokenRepositorySpy = makeUpdateAccessTokenRepository();
  const sut = new AuthUseCase({
    loadUserByEmailRepository: loadUserByEmailRepositorySpy,
    encrypter: encrypterSpy,
    tokenGenerator: tokenGeneratorSpy,
    updateAccessTokenRepository: updateAccessTokenRepositorySpy,
  });

  return {
    sut,
    loadUserByEmailRepositorySpy,
    encrypterSpy,
    tokenGeneratorSpy,
    updateAccessTokenRepositorySpy,
  };
};

describe('AuthUseCase', () => {
  test('should throw error if email is not provided', async () => {
    const { sut } = makeSut();
    const promise = sut.auth();
    expect(promise).rejects.toThrow(new MissingParamError('email'));
  });

  test('should throw error if password is not provided', async () => {
    const { sut } = makeSut();
    const promise = sut.auth('any_email@gmail.com');
    expect(promise).rejects.toThrow(new MissingParamError('password'));
  });

  test('should call LoadUserByEmailRepository with correct email', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut();
    await sut.auth('any_email@gmail.com', 'any_password');
    expect(loadUserByEmailRepositorySpy.email).toBe('any_email@gmail.com');
  });

  test('should throw error if invalid dependencies are provided', async () => {
    const invalid = {};
    const loadUserByEmailRepository = makeLoadUserByEmailRepository();
    const encrypter = makeEncrypter();

    const suts = [
      new AuthUseCase(),
      new AuthUseCase({}),
      new AuthUseCase({ loadUserByEmailRepository: invalid }),
      new AuthUseCase({
        loadUserByEmailRepository,
      }),
      new AuthUseCase({ loadUserByEmailRepository, encrypter: invalid }),
      new AuthUseCase({
        loadUserByEmailRepository,
        encrypter,
      }),
      new AuthUseCase({
        loadUserByEmailRepository,
        encrypter,
        tokenGenerator: invalid,
      }),
    ];

    suts.forEach((sut) => {
      const promise = sut.auth('any_email@gmail.com', 'any_password');
      expect(promise).rejects.toThrow();
    });
  });

  test('should continue throwing error if an error occur', async () => {
    const invalid = {};
    const loadUserByEmailRepository = makeLoadUserByEmailRepository();
    const encrypter = makeEncrypter();

    const suts = [
      new AuthUseCase({ loadUserByEmailRepository: makeLoadUserByEmailRepositoryWithError() }),
      new AuthUseCase({ loadUserByEmailRepository, encrypter: makeEncrypterWithError() }),
      new AuthUseCase({ loadUserByEmailRepository, encrypter, tokenGenerator: makeTokenGeneratorWithError() }),
    ];

    suts.forEach((sut) => {
      const promise = sut.auth('any_email@gmail.com', 'any_password');
      expect(promise).rejects.toThrow();
    });
  });

  test('should return null if an invalid email is provided', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut();
    loadUserByEmailRepositorySpy.user = null;
    const accessToken = await sut.auth('invalid_email@gmail.com', 'any_password');
    expect(accessToken).toBeNull();
  });

  test('should return null if an invalid password is provided', async () => {
    const { sut, encrypterSpy } = makeSut();
    encrypterSpy.isValid = false;
    const accessToken = await sut.auth('valid_email@gmail.com', 'invalid_password');
    expect(accessToken).toBeNull();
  });

  test('should call Encrypter with correct values', async () => {
    const { sut, loadUserByEmailRepositorySpy, encrypterSpy } = makeSut();
    await sut.auth('valid_email@gmail.com', 'any_password');
    expect(encrypterSpy.password).toBe('any_password');
    expect(encrypterSpy.hashedPassword).toBe(loadUserByEmailRepositorySpy.user.password);
  });

  test('should call TokenGenerator with correct userId', async () => {
    const { sut, loadUserByEmailRepositorySpy, tokenGeneratorSpy } = makeSut();
    await sut.auth('valid_email@gmail.com', 'valid_password');
    expect(tokenGeneratorSpy.userId).toBe(loadUserByEmailRepositorySpy.user.id);
  });

  test('should return an access token if valid credentials are provided', async () => {
    const { sut, tokenGeneratorSpy } = makeSut();
    const accessToken = await sut.auth('valid_email@gmail.com', 'valid_password');
    expect(accessToken).toBe(tokenGeneratorSpy.accessToken);
    expect(accessToken).toBeTruthy();
  });

  test('should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, loadUserByEmailRepositorySpy, updateAccessTokenRepositorySpy, tokenGeneratorSpy } = makeSut();
    await sut.auth('valid_email@gmail.com', 'valid_password');
    expect(updateAccessTokenRepositorySpy.userId).toBe(loadUserByEmailRepositorySpy.user.id);
    expect(updateAccessTokenRepositorySpy.accessToken).toBe(tokenGeneratorSpy.accessToken);
  });
});
