import { getErrorResponse } from '../../helpers/get-error-response';
import { ok } from '../../helpers/http-successful-responses';
import { User } from '../../models/user';
import { HttpRequest, HttpResponse, IController } from '../protocols';
import { IDeleteUserRepository } from './protocols';

export class DeleteUserController implements IController {
  constructor(private readonly deleteUserRepository: IDeleteUserRepository) {}

  async handle(
    httpRequest: HttpRequest<unknown>,
  ): Promise<HttpResponse<User | string>> {
    const userId = httpRequest.params.userId;

    try {
      const user = await this.deleteUserRepository.deleteUser(userId);
      return ok(user);
    } catch (error) {
      return getErrorResponse(error);
    }
  }
}
