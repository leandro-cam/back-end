import { createUserWithoutPasswordFromUserEncrypted } from '../../helpers/create-user-without-password-from-user-encrypted';
import { getErrorResponse } from '../../helpers/get-error-response';
import { ok } from '../../helpers/http-successful-responses';
import { User, UserEncrypted, UserWithoutPassword } from '../../models/user';
import { HttpResponse, IController } from '../protocols';
import { IGetUsersRepository } from './protocols';

export class GetUsersController implements IController {
  constructor(private readonly getUsersRepository: IGetUsersRepository) {}

  async handle(): Promise<HttpResponse<UserWithoutPassword[] | string>> {
    let usersEncrypted: UserEncrypted[];
    try {
      usersEncrypted = await this.getUsersRepository.getUsers();
    } catch (error) {
      return getErrorResponse(error);
    }

    const usersWithoutPassword = usersEncrypted.map(
      createUserWithoutPasswordFromUserEncrypted,
    );

    return ok(usersWithoutPassword);
  }
}
