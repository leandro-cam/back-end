const validator = require('validator');

const EmailValidator = require('./email-validator');

const makeSut = (isValidEmail = true) => {
  validator.isValidEmail = isValidEmail;

  return new EmailValidator();
};

describe('EmailValidator', () => {
  test('should return true when validator returns true', () => {
    const sut = makeSut();
    const isValidEmail = sut.isValid('valid_email');

    expect(isValidEmail).toBe(true);
  });

  test('should return false when validator returns false', () => {
    const sut = makeSut(false);
    const isValidEmail = sut.isValid('invalid_email');

    expect(isValidEmail).toBe(false);
  });

  test('should call validator with correct email', () => {
    const sut = makeSut();
    const email = 'any_email';

    sut.isValid(email);

    expect(validator.email).toBe(email);
  });
});
