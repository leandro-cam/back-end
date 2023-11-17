import { compare } from 'bcryptjs';
import { fieldsToString } from '../../helpers/fields-to-string';
import { getErrorResponse } from '../../helpers/get-error-response';
import {
  BadRequestResponse,
  ServerErrorResponse,
} from '../../helpers/http-error-responses';
import { UserEncrypted, UserWithToken } from '../../models/user';
import { IGetUserByIdRepository } from '../get-user-by-id/protocols';
import { HttpRequest, HttpResponse, IController } from '../protocols';
import { CreateTokenBody, CreateTokenBodyField } from './protocols';
import jwt from 'jsonwebtoken';
import { createUserWithoutPasswordFromUserEncrypted } from '../../helpers/create-user-without-password-from-user-encrypted';
import { ok } from '../../helpers/http-successful-responses';

export class CreateTokenController implements IController {
  constructor(private readonly getUserByIdRepository: IGetUserByIdRepository) {}

  async handle(
    httpRequest: HttpRequest<CreateTokenBody>,
  ): Promise<HttpResponse<UserWithToken | string>> {
    const { body } = httpRequest;
    const bodyFields: CreateTokenBodyField[] = ['id', 'email', 'password'];

    if (!body || typeof body !== 'object') {
      return new BadRequestResponse(
        `Request must have in the body an object with the fields: ${fieldsToString(
          bodyFields,
        )}`,
      ).response();
    }

    for (const field of bodyFields) {
      if (!body[field]?.length) {
        return new BadRequestResponse(
          `Body must have the field: "${field}"`,
        ).response();
      }
    }

    let userEncrypted: UserEncrypted;
    try {
      userEncrypted = await this.getUserByIdRepository.getUserById(body.id);
    } catch (error) {
      return getErrorResponse(error);
    }

    const isSamePassword = await compare(
      body.password,
      userEncrypted.passwordHash,
    );

    if (body.email !== userEncrypted.email || !isSamePassword) {
      return new BadRequestResponse(
        'Incorrect body email or password',
      ).response();
    }

    if (!process.env.TOKEN_SECRET) {
      const error = 'Missing TOKEN_SECRET env';
      console.error(error);
      return new ServerErrorResponse(error).response();
    }

    const token = jwt.sign(
      { id: body.id, email: body.email },
      process.env.TOKEN_SECRET,
      {
        expiresIn: process.env.TOKEN_EXPIRATION,
      },
    );

    const userWithoutPassword =
      createUserWithoutPasswordFromUserEncrypted(userEncrypted);

    return ok<UserWithToken>({ ...userWithoutPassword, token });
  }
}
