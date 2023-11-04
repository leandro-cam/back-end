export interface HttpRequest<Body> {
  params?: any;
  headers?: any;
  body?: Body;
}

export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  SERVER_ERROR = 500,
}

export interface HttpResponse<T> {
  statusCode: HttpStatusCode;
  body: T;
}

export interface IController {
  handle(httpRequest: HttpRequest<unknown>): Promise<HttpResponse<unknown>>;
}
