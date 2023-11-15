import { hash } from 'bcryptjs';
import { fieldsToString } from '../../helpers/fields-to-string';
import { getErrorResponse } from '../../helpers/get-error-response';
import {
  BadRequestResponse,
  ServerErrorResponse,
} from '../../helpers/http-error-responses';
import { ok } from '../../helpers/http-successful-responses';
import { User, UserEncrypted, UserWithoutPassword } from '../../models/user';
import { HttpRequest, HttpResponse, IController } from '../protocols';
import {
  IUpdateUserRepository,
  UpdateUserBodyField,
  UpdateUserSomeFieldBody,
  UpdateUserSomeFieldBodyEncrypted,
} from './protocols';
import { createUserWithoutPasswordFromUserEncrypted } from '../../helpers/create-user-without-password-from-user-encrypted';

export class UpdateUserSomeFieldController implements IController {
  constructor(private readonly updateUserRepository: IUpdateUserRepository) {}

  private static createUpdateUserSomeFieldBodyEncryptedFromUpdateUserSomeFieldBody(
    updateUserBody: UpdateUserSomeFieldBody,
    passwordHash: string,
  ): UpdateUserSomeFieldBodyEncrypted {
    return {
      firstName: updateUserBody.firstName,
      lastName: updateUserBody.lastName,
      passwordHash,
    };
  }

  async handle(
    httpRequest: HttpRequest<UpdateUserSomeFieldBody>,
  ): Promise<HttpResponse<UserWithoutPassword | string>> {
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

    let passwordHash = '';
    if (body.password) {
      try {
        passwordHash = await hash(body.password, 8);
      } catch (error) {
        console.error(error);
        throw new ServerErrorResponse('Failed to create password hash');
      }
    }

    const userBodyEncrypted =
      UpdateUserSomeFieldController.createUpdateUserSomeFieldBodyEncryptedFromUpdateUserSomeFieldBody(
        body,
        passwordHash,
      );

    let userEncrypted: UserEncrypted;
    try {
      userEncrypted = await this.updateUserRepository.updateUser(userId, body);
    } catch (error) {
      return getErrorResponse(error);
    }

    const userWithoutPassword =
      createUserWithoutPasswordFromUserEncrypted(userEncrypted);

    return ok(userWithoutPassword);
  }
}
