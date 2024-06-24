const jwt = require('jsonwebtoken');
const { MissingParamError } = require('../errors');

class TokenGenerator {
  constructor(secret) {
    this.secret = secret;
  }

  async generate(id) {
    if (!id) {
      throw new MissingParamError('id');
    }

    if (!this.secret) {
      throw new MissingParamError('secret');
    }

    return jwt.sign(id, this.secret);
  }
}

const makeSut = () => {
  return new TokenGenerator('secret');
};

describe('TokenGenerator', () => {
  beforeEach(() => {
    jwt.token = 'any_token';
  });

  test('should return null if JWT returns null', async () => {
    jwt.token = null;

    const sut = makeSut();
    const token = await sut.generate('any_id');
    expect(token).toBeNull();
  });

  test('should return token if JWT returns token', async () => {
    const sut = makeSut();
    const token = await sut.generate('any_id');
    expect(token).toBe(jwt.token);
  });

  test('should call JWT with correct params', async () => {
    const sut = makeSut();
    await sut.generate('any_id');
    expect(jwt.id).toBe('any_id');
    expect(jwt.secret).toBe(sut.secret);
  });

  test('should throw Error if id is not provided', async () => {
    const sut = makeSut();
    const promise = sut.generate();
    expect(promise).rejects.toThrow(new MissingParamError('id'));
  });

  test('should throw Error if secret is not provided', async () => {
    const sut = new TokenGenerator();
    const promise = sut.generate('any_id');
    expect(promise).rejects.toThrow(new MissingParamError('secret'));
  });
});
