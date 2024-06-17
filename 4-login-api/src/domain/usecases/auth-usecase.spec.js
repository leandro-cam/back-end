const { MissingParamError } = require('../../utils/errors');

class AuthUseCase {
  async auth(email, password) {
    if (!email) {
      throw new MissingParamError('email');
    }

    if (!password) {
      throw new MissingParamError('password');
    }
  }
}

describe('AuthUseCase', () => {
  test('should throw error if email is not provided', async () => {
    const sut = new AuthUseCase();
    const promise = sut.auth();
    expect(promise).rejects.toThrow(new MissingParamError('email'));
  });

  test('should throw error if password is not provided', async () => {
    const sut = new AuthUseCase();
    const promise = sut.auth('any_email@gmail.com');
    expect(promise).rejects.toThrow(new MissingParamError('password'));
  });
});
