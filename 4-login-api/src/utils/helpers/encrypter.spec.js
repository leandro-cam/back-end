const bcrypt = require('bcrypt');
const Encrypter = require('./encrypter');
const { MissingParamError } = require('../errors');

const makeSut = () => {
  return new Encrypter();
};

describe('Encrypter', () => {
  beforeEach(() => {
    bcrypt.isValid = true;
    bcrypt.value = undefined;
    bcrypt.hash = undefined;
  });

  test('should return true if bcrypt returns true', async () => {
    const sut = makeSut();
    const isValid = await sut.compare('any_value', 'any_hash');
    expect(isValid).toBe(true);
  });

  test('should return false if bcrypt returns false', async () => {
    bcrypt.isValid = false;

    const sut = makeSut();
    const isValid = await sut.compare('any_value', 'any_hash');
    expect(isValid).toBe(false);
  });

  test('should call bcrypt with correct values', async () => {
    const sut = makeSut();
    await sut.compare('any_value', 'any_hash');
    expect(bcrypt.value).toBe('any_value');
    expect(bcrypt.hash).toBe('any_hash');
  });

  test('should throw Error if params are not provided', async () => {
    const sut = makeSut();
    expect(sut.compare()).rejects.toThrow(new MissingParamError('value'));
    expect(sut.compare('any_value')).rejects.toThrow(new MissingParamError('hash'));
  });
});
