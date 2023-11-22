import { HttpResponse, HttpStatusCode } from '../controllers/protocols';

export abstract class BaseErrorResponse extends Error {
  constructor(
    protected statusCode: HttpStatusCode,
    message: string,
  ) {
    super(message);
  }

  response(): HttpResponse<string> {
    return {
      statusCode: this.statusCode,
      body: this.message,
    };
  }
}

export class BadRequestResponse extends BaseErrorResponse {
  constructor(message: string) {
    super(HttpStatusCode.BAD_REQUEST, message);
  }
}

export class ForbiddenResponse extends BaseErrorResponse {
  constructor(message: string) {
    super(HttpStatusCode.FORBIDDEN, message);
  }
}

export class NotFoundResponse extends BaseErrorResponse {
  constructor(message: string) {
    super(HttpStatusCode.NOT_FOUND, message);
  }
}

export class ServerErrorResponse extends BaseErrorResponse {
  constructor(message = 'Something went wrong') {
    super(HttpStatusCode.SERVER_ERROR, message);
  }
}
