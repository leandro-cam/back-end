module.exports = {
  isValidEmail: true,

  // eslint-disable-next-line no-unused-vars
  isEmail(email) {
    this.email = email;

    return this.isValidEmail;
  },
};
