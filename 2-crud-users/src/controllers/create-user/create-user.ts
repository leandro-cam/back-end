import validator from 'validator';
import { User } from '../../models/user';
import { badRequest, created, fieldsToString, serverError } from '../helpers';
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
      return badRequest(
        `Request must have in the body an object with the fields: ${fieldsToString(
          bodyFields,
        )}`,
      );
    }

    for (const field of bodyFields) {
      if (!httpRequest.body[field]?.length) {
        return badRequest(`Body must have the field: "${field}"`);
      }
    }

    if (Object.keys(httpRequest.body).length !== bodyFields.length) {
      return badRequest(
        `Body have field not allowed. The allowed fields are: ${fieldsToString(
          bodyFields,
        )}`,
      );
    }

    if (!validator.isEmail(httpRequest.body.email)) {
      return badRequest('Body email is invalid');
    }

    try {
      const user = await this.createUserRepository.createUser(httpRequest.body);
      return created(user);
    } catch (error) {
      return serverError((error as Error)?.message);
    }
  }
}