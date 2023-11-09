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

export class UpdateUserAllFieldsController implements IController {
  constructor(private readonly updateUserRepository: IUpdateUserRepository) {}

  async handle(
    httpRequest: HttpRequest<UpdateUserBody>,
  ): Promise<HttpResponse<User | string>> {
    const userId = httpRequest.params.userId;
    const body = httpRequest.body;
    const bodyFields: UpdateUserBodyField[] = [
      'firstName',
      'lastName',
      'password',
    ];

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

    if (Object.keys(body).length !== bodyFields.length) {
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
