import { User } from '../../models/user';
import { ok, serverError } from '../helpers';
import { HttpRequest, HttpResponse, IController } from '../protocols';
import { IGetUserByIdRepository } from './protocols';

export class GetUserByIdController implements IController {
  constructor(private readonly getUserByIdRepository: IGetUserByIdRepository) {}

  async handle(
    httpRequest: HttpRequest<unknown>,
  ): Promise<HttpResponse<User | string>> {
    const userId = httpRequest.params.userId;

    try {
      const user = await this.getUserByIdRepository.getUserById(userId);
      return ok(user);
    } catch (error) {
      return serverError((error as Error)?.message);
    }
  }
}
