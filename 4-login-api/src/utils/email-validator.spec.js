class EmailValidator {
  isValid() {
    return true;
  }
}

describe('EmailValidator', () => {
  test('should return true when validator returns true', () => {
    const sut = new EmailValidator();
    const isValidEmail = sut.isValid('valid_email');

    expect(isValidEmail).toBe(true);
  });
});
