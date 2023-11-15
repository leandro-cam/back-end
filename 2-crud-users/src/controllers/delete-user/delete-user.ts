import { createUserWithoutPasswordFromUserEncrypted } from '../../helpers/create-user-without-password-from-user-encrypted';
import { getErrorResponse } from '../../helpers/get-error-response';
import { ok } from '../../helpers/http-successful-responses';
import { UserEncrypted, UserWithoutPassword } from '../../models/user';
import { HttpRequest, HttpResponse, IController } from '../protocols';
import { IDeleteUserRepository } from './protocols';

export class DeleteUserController implements IController {
  constructor(private readonly deleteUserRepository: IDeleteUserRepository) {}

  async handle(
    httpRequest: HttpRequest<unknown>,
  ): Promise<HttpResponse<UserWithoutPassword | string>> {
    const userId = httpRequest.params.userId;

    let userEncrypted: UserEncrypted;
    try {
      userEncrypted = await this.deleteUserRepository.deleteUser(userId);
    } catch (error) {
      return getErrorResponse(error);
    }

    const userWithoutPassword =
      createUserWithoutPasswordFromUserEncrypted(userEncrypted);

    return ok(userWithoutPassword);
  }
}
