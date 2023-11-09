import { fieldsToString } from '../../helpers/fields-to-string';
import { getErrorResponse } from '../../helpers/get-error-response';
import { BadRequestResponse } from '../../helpers/http-error-responses';
import { ok } from '../../helpers/http-successful-responses';
import { User } from '../../models/user';
import { HttpRequest, HttpResponse, IController } from '../protocols';
import {
  IUpdateUserRepository,
  UpdateUserBody,
  UpdateUserBodyField,
} from './protocols';

export class UpdateUserSomeFieldController implements IController {
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
      return new BadRequestResponse(
        `Request must have in the body an object, that accepts the fields: ${fieldsToString(
          bodyFields,
        )}`,
      ).response();
    }

    const isInvalidBody = Object.keys(body).some(
      (field) => !(bodyFields as string[]).includes(field),
    );

    if (isInvalidBody) {
      return new BadRequestResponse(
        `Body have field not allowed. The allowed fields are: ${fieldsToString(
          bodyFields,
        )}`,
      ).response();
    }

    try {
      const user = await this.updateUserRepository.updateUser(
        userId,
        body as UpdateUserBody,
      );
      return ok(user);
    } catch (error) {
      return getErrorResponse(error);
    }
  }
}
