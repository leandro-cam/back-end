const { MissingParamError } = require('../../utils/errors');

class AuthUseCase {
  async auth(email) {
    if (!email) {
      throw new MissingParamError('email');
    }
  }
}

describe('AuthUseCase', () => {
  test('should throw error if email is not provided', async () => {
    const sut = new AuthUseCase();
    const promise = sut.auth();
    expect(promise).rejects.toThrow(new MissingParamError('email'));
  });
});
