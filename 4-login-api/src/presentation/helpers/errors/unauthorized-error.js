module.exports = class UnauthorizedError extends Error {
  constructor() {
    super('User not identified');
    this.name = 'UnauthorizedError';
  }
};
