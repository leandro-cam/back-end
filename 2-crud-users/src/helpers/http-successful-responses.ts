import { HttpResponse, HttpStatusCode } from '../controllers/protocols';

export const ok = <T>(body: T): HttpResponse<T> => ({
  statusCode: HttpStatusCode.OK,
  body,
});

export const created = <T>(body: T): HttpResponse<T> => ({
  statusCode: HttpStatusCode.CREATED,
  body,
});
