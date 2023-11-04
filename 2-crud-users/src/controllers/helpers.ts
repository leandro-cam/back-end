import { HttpResponse, HttpStatusCode } from './protocols';

export const ok = <T>(body: T): HttpResponse<T> => ({
  statusCode: HttpStatusCode.OK,
  body,
});

export const created = <T>(body: T): HttpResponse<T> => ({
  statusCode: HttpStatusCode.CREATED,
  body,
});

export const badRequest = (body: string): HttpResponse<string> => ({
  statusCode: HttpStatusCode.BAD_REQUEST,
  body,
});

export const serverError = (body?: string): HttpResponse<string> => ({
  statusCode: HttpStatusCode.SERVER_ERROR,
  body: body || 'Something went wrong',
});
