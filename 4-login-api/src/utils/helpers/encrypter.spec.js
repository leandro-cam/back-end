const bcrypt = require('bcrypt');

class Encrypter {
  async compare(value, hash) {
    return await bcrypt.compare(value, hash);
  }
}

describe('Encrypter', () => {
  test('should return true if bcrypt returns true', async () => {
    bcrypt.isValid = true;

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
});
