import { BaseErrorResponse, ServerErrorResponse } from './http-error-responses';

export const getErrorResponse = (error: unknown) => {
  if (error instanceof BaseErrorResponse) {
    return error.response();
  }

  return new ServerErrorResponse((error as Error)?.message).response();
};
