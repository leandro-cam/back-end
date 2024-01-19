module.exports = class ServerError extends Error {
  constructor() {
    super('An error occurred. Please, try again');
    this.name = 'ServerError';
  }
};
