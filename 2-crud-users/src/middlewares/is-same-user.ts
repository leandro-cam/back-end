import { NextFunction, Request, Response } from 'express';
import { ForbiddenResponse } from '../helpers/http-error-responses';

export const isSameUserMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): Response | void => {
  const userId = req.params.userId;
  const tokenUserId = res.locals.userId;

  if (tokenUserId !== userId) {
    const { statusCode, body } = new ForbiddenResponse(
      'Token user id and user id passed by param are different',
    ).response();

    return res.status(statusCode).send(body);
  }

  return next();
};
