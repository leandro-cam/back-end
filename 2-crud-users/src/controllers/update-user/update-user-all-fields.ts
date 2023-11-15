import { hash } from 'bcryptjs';
import { createUserWithoutPasswordFromUserEncrypted } from '../../helpers/create-user-without-password-from-user-encrypted';
import { fieldsToString } from '../../helpers/fields-to-string';
import { getErrorResponse } from '../../helpers/get-error-response';
import {
  BadRequestResponse,
  ServerErrorResponse,
} from '../../helpers/http-error-responses';
import { ok } from '../../helpers/http-successful-responses';
import { UserEncrypted, UserWithoutPassword } from '../../models/user';
import { HttpRequest, HttpResponse, IController } from '../protocols';
import {
  IUpdateUserRepository,
  UpdateUserAllFieldsBody,
  UpdateUserAllFieldsBodyEncrypted,
  UpdateUserBodyField,
} from './protocols';

export class UpdateUserAllFieldsController implements IController {
  constructor(private readonly updateUserRepository: IUpdateUserRepository) {}

  private static createUpdateUserAllFieldsBodyEncryptedFromUpdateUserAllFieldsBody(
    updateUserBody: UpdateUserAllFieldsBody,
    passwordHash: string,
  ): UpdateUserAllFieldsBodyEncrypted {
    return {
      firstName: updateUserBody.firstName,
      lastName: updateUserBody.lastName,
      passwordHash,
    };
  }

  async handle(
    httpRequest: HttpRequest<UpdateUserAllFieldsBody>,
  ): Promise<HttpResponse<UserWithoutPassword | string>> {
    const { userId } = httpRequest.params;
    const { body } = httpRequest;
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

    let passwordHash = '';
    try {
      passwordHash = await hash(body.password, 8);
    } catch (error) {
      console.error(error);
      throw new ServerErrorResponse('Failed to create password hash');
    }

    const userBodyEncrypted =
      UpdateUserAllFieldsController.createUpdateUserAllFieldsBodyEncryptedFromUpdateUserAllFieldsBody(
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
