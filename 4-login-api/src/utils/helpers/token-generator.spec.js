const jwt = require('jsonwebtoken');

class TokenGenerator {
  constructor(secret) {
    this.secret = secret;
  }

  async generate(id) {
    return jwt.sign(id, this.secret);
  }
}

const makeSut = () => {
  return new TokenGenerator('secret');
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

  test('should call JWT with correct params', async () => {
    jwt.token = 'any_token';

    const sut = makeSut();
    await sut.generate('any_id');
    expect(jwt.id).toBe('any_id');
    expect(jwt.secret).toBe(sut.secret);
  });
});
