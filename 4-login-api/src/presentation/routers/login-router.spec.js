class LoginRouter {
  route(httpRequest) {
    if (!httpRequest.body.email || !httpRequest.body.password) {
      return {
        statusCode: 400,
      };
    }
  }
}

describe('Login Router', () => {
  test('should return 400 if email is not passed', () => {
    const sut = new LoginRouter();
    const httpRequest = { body: { password: 'any_password' } };
    const httpResponse = sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
  });

  test('should return 400 if password is not passed', () => {
    const sut = new LoginRouter();
    const httpRequest = { body: { email: 'any_email' } };
    const httpResponse = sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
  });
});
