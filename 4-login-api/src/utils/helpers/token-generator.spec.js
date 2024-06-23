const jwt = require('jsonwebtoken');

class TokenGenerator {
  async generate(id) {
    return jwt.sign(id, 'secret');
  }
}

const makeSut = () => {
  return new TokenGenerator();
};

describe('TokenGenerator', () => {
  beforeEach(() => {
    jwt.token = null;
  });

  test('should return null if JWT returns null', async () => {
    const sut = makeSut();
    const token = await sut.generate('any_id');
    expect(token).toBeNull();
  });

  test('should return token if JWT returns token', async () => {
    jwt.token = 'any_token';

    const sut = makeSut();
    const token = await sut.generate('any_id');
    expect(token).toBe(jwt.token);
  });

  test('should call JWT with correct id', async () => {
    jwt.token = 'any_token';

    const sut = makeSut();
    const token = await sut.generate('any_id');
    expect(token).toBe(jwt.token);
  });
});
