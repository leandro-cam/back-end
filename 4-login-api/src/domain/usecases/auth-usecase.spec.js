class AuthUseCase {
  async auth(email) {
    if (!email) {
      throw new Error();
    }
  }
}

describe('Auth UseCase', () => {
  test('should return null if email is not provided', async () => {
    const sut = new AuthUseCase();
    const promise = sut.auth();
    expect(promise).rejects.toThrow();
  });
});
