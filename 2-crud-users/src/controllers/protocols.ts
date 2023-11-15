export interface HttpRequest<Body> {
  params?: any;
  headers?: any;
  body?: Body;
}

export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  SERVER_ERROR = 500,
}

export interface HttpResponse<T> {
  statusCode: HttpStatusCode;
  body: T;
}

export type PasswordHashType = {
  passwordHash: string;
};

export interface IController {
  handle(httpRequest: HttpRequest<unknown>): Promise<HttpResponse<unknown>>;
}
