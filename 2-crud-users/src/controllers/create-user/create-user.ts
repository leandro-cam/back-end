import validator from 'validator';
import { fieldsToString } from '../../helpers/fields-to-string';
import { getErrorResponse } from '../../helpers/get-error-response';
import { BadRequestResponse } from '../../helpers/http-error-responses';
import { created } from '../../helpers/http-successful-responses';
import { User } from '../../models/user';
import { HttpRequest, HttpResponse, IController } from '../protocols';
import {
  CreateUserBody,
  CreateUserBodyField,
  ICreateUserRepository,
} from './protocols';

export class CreateUserController implements IController {
  constructor(private readonly createUserRepository: ICreateUserRepository) {}

  async handle(
    httpRequest: HttpRequest<CreateUserBody>,
  ): Promise<HttpResponse<User | string>> {
    const bodyFields: CreateUserBodyField[] = [
      'firstName',
      'lastName',
      'email',
      'password',
    ];

    if (!httpRequest?.body || typeof httpRequest?.body !== 'object') {
      return new BadRequestResponse(
        `Request must have in the body an object with the fields: ${fieldsToString(
          bodyFields,
        )}`,
      ).response();
    }

    for (const field of bodyFields) {
      if (!httpRequest.body[field]?.length) {
        return new BadRequestResponse(
          `Body must have the field: "${field}"`,
        ).response();
      }
    }

    if (Object.keys(httpRequest.body).length !== bodyFields.length) {
      return new BadRequestResponse(
        `Body have field not allowed. The allowed fields are: ${fieldsToString(
          bodyFields,
        )}`,
      ).response();
    }

    if (!validator.isEmail(httpRequest.body.email)) {
      return new BadRequestResponse('Body email is invalid').response();
    }

    try {
      const user = await this.createUserRepository.createUser(httpRequest.body);
      return created(user);
    } catch (error) {
      return getErrorResponse(error);
    }
  }
}
