import { User } from '../../models/user';
import { badRequest, fieldsToString, ok, serverError } from '../helpers';
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
      return badRequest(
        `Request must have in the body an object with the fields: ${fieldsToString(
          bodyFields,
        )}`,
      );
    }

    for (const field of bodyFields) {
      if (!body[field]?.length) {
        return badRequest(`Body must have the field: "${field}"`);
      }
    }

    if (Object.keys(body).length !== bodyFields.length) {
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
