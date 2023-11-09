import { getErrorResponse } from '../../helpers/get-error-response';
import { ok } from '../../helpers/http-successful-responses';
import { User } from '../../models/user';
import { HttpResponse, IController } from '../protocols';
import { IGetUsersRepository } from './protocols';

export class GetUsersController implements IController {
  constructor(private readonly getUsersRepository: IGetUsersRepository) {}

  async handle(): Promise<HttpResponse<User[] | string>> {
    try {
      const users = await this.getUsersRepository.getUsers();
      return ok(users);
    } catch (error) {
      return getErrorResponse(error);
    }
  }
}
