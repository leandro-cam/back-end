import { User } from '../../models/user';
import { badRequest, fieldsToString, ok, serverError } from '../helpers';
import { HttpRequest, HttpResponse, IController } from '../protocols';
import {
  IUpdateUserRepository,
  UpdateUserBody,
  UpdateUserBodyField,
} from './protocols';

export class UpdateUserController implements IController {
  constructor(private readonly updateUserRepository: IUpdateUserRepository) {}

  async handle(
    httpRequest: HttpRequest<unknown>,
  ): Promise<HttpResponse<User | string>> {
    const userId = httpRequest.params.userId;
    const body = httpRequest.body;
    const bodyFields: UpdateUserBodyField[] = [
      'firstName',
      'lastName',
      'password',
    ];

    if (!body || typeof body !== 'object' || !Object.keys(body).length) {
      return badRequest(
        `Request must have in the body an object, that accepts the fields: ${bodyFields
          .map((field) => `"${field}"`)
          .join(', ')}`,
      );
    }

    const isInvalidBody = Object.keys(body).some(
      (field) => !(bodyFields as string[]).includes(field),
    );

    if (isInvalidBody) {
      return badRequest(
        `Body have field not allowed. The allowed fields are: ${fieldsToString(
          bodyFields,
        )}`,
      );
    }

    try {
      const user = await this.updateUserRepository.updateUser(
        userId,
        body as UpdateUserBody,
      );
      return ok(user);
    } catch (error) {
      return serverError((error as Error)?.message);
    }
  }
}
