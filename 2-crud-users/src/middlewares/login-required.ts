import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { IGetUserByIdRepository } from '../controllers/get-user-by-id/protocols';
import { getErrorResponse } from '../helpers/get-error-response';
import {
  BadRequestResponse,
  ServerErrorResponse,
} from '../helpers/http-error-responses';
import { IMiddleware } from './protocols';

export class LoginRequiredMiddleware implements IMiddleware {
  constructor(public readonly getUserByIdRepository: IGetUserByIdRepository) {}

  async handle(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    const { authorization } = req.headers;

    if (!authorization) {
      const { statusCode, body } = new BadRequestResponse(
        'Request must have authorization with token',
      ).response();

      return res.status(statusCode).send(body);
    }

    const [, token] = authorization.split(' ');

    if (!process.env.TOKEN_SECRET) {
      const error = 'Missing TOKEN_SECRET env';
      console.error(error);

      const { statusCode, body } = new ServerErrorResponse(error).response();
      return res.status(statusCode).send(body);
    }

    let data: string | JwtPayload;
    try {
      data = jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (error) {
      const { statusCode, body } = new BadRequestResponse(
        'Expired or invalid token in authorization',
      ).response();

      return res.status(statusCode).send(body);
    }

    if (typeof data === 'string') {
      const { statusCode, body } = new BadRequestResponse(
        'Invalid token in authorization',
      ).response();

      return res.status(statusCode).send(body);
    }

    const { id, email } = data;

    if (!id || !email) {
      const { statusCode, body } = new BadRequestResponse(
        'Invalid token in authorization',
      ).response();

      return res.status(statusCode).send(body);
    }

    try {
      await this.getUserByIdRepository.getUserById(id);
    } catch (error) {
      const { statusCode, body } = getErrorResponse(error);

      if (statusCode === 404) {
        return res.status(statusCode).send('Token user not found');
      }

      return res.status(statusCode).send(body);
    }

    res.locals.userId = id;

    return next();
  }
}
