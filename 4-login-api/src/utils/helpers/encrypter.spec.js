const bcrypt = require('bcrypt');
const Encrypter = require('./encrypter');

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
});
