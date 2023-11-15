import { hash } from 'bcryptjs';
import validator from 'validator';
import { fieldsToString } from '../../helpers/fields-to-string';
import { getErrorResponse } from '../../helpers/get-error-response';
import {
  BadRequestResponse,
  ServerErrorResponse,
} from '../../helpers/http-error-responses';
import { created } from '../../helpers/http-successful-responses';
import { User, UserEncrypted, UserWithoutPassword } from '../../models/user';
import { HttpRequest, HttpResponse, IController } from '../protocols';
import {
  CreateUserBody,
  CreateUserBodyEncrypted,
  CreateUserBodyField,
  ICreateUserRepository,
} from './protocols';
import { createUserWithoutPasswordFromUserEncrypted } from '../../helpers/create-user-without-password-from-user-encrypted';

export class CreateUserController implements IController {
  constructor(private readonly createUserRepository: ICreateUserRepository) {}

  private static createUserBodyEncryptedFromCreateUserBody(
    createUserBody: CreateUserBody,
    passwordHash: string,
  ): CreateUserBodyEncrypted {
    return {
      email: createUserBody.email,
      firstName: createUserBody.firstName,
      lastName: createUserBody.lastName,
      passwordHash,
    };
  }

  async handle(
    httpRequest: HttpRequest<CreateUserBody>,
  ): Promise<HttpResponse<UserWithoutPassword | string>> {
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

    let passwordHash = '';
    try {
      passwordHash = await hash(httpRequest.body.password, 8);
    } catch (error) {
      console.error(error);
      throw new ServerErrorResponse('Failed to create password hash');
    }

    const userBodyEncrypted =
      CreateUserController.createUserBodyEncryptedFromCreateUserBody(
        httpRequest.body,
        passwordHash,
      );

    let userEncrypted: UserEncrypted;
    try {
      userEncrypted =
        await this.createUserRepository.createUser(userBodyEncrypted);
    } catch (error) {
      return getErrorResponse(error);
    }

    const userWithoutPassword =
      createUserWithoutPasswordFromUserEncrypted(userEncrypted);

    return created(userWithoutPassword);
  }
}
