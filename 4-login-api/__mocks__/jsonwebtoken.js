module.exports = {
  sign(id, secret) {
    this.id = id;
    this.secret = secret;

    return this.token;
  },
};
