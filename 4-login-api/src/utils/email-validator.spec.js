const validator = require('validator');

class EmailValidator {
  isValid(email, isValidEmail = true) {
    validator.isValidEmail = isValidEmail;

    return validator.isEmail(email);
  }
}

const makeSut = () => {
  return new EmailValidator();
};

describe('EmailValidator', () => {
  test('should return true when validator returns true', () => {
    const sut = makeSut();
    const isValidEmail = sut.isValid('valid_email');

    expect(isValidEmail).toBe(true);
  });

  test('should return false when validator returns false', () => {
    const sut = makeSut();
    const isValidEmail = sut.isValid('invalid_email', false);

    expect(isValidEmail).toBe(false);
  });
});
