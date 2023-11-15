import { UserEncrypted } from '../../models/user';

export interface IGetUsersRepository {
  getUsers(): Promise<UserEncrypted[]>;
}
