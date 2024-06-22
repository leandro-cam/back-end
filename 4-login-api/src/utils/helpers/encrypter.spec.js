const bcrypt = require('bcrypt');

class Encrypter {
  async compare(value, hash) {
    return await bcrypt.compare(value, hash);
  }
}

describe('Encrypter', () => {
  beforeEach(() => {
    bcrypt.isValid = true;
    bcrypt.value = undefined;
    bcrypt.hash = undefined;
  });

  test('should return true if bcrypt returns true', async () => {
    const sut = new Encrypter();
    const isValid = await sut.compare('any_value', 'any_hash');
    expect(isValid).toBe(true);
  });

  test('should return false if bcrypt returns false', async () => {
    bcrypt.isValid = false;

    const sut = new Encrypter();
    const isValid = await sut.compare('any_value', 'any_hash');
    expect(isValid).toBe(false);
  });

  test('should call bcrypt with correct values', async () => {
    const sut = new Encrypter();
    await sut.compare('any_value', 'any_hash');
    expect(bcrypt.value).toBe('any_value');
    expect(bcrypt.hash).toBe('any_hash');
  });
});
