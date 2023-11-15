import { User, UserEncrypted } from '../../models/user';

export interface IDeleteUserRepository {
  deleteUser(userId: string): Promise<UserEncrypted>;
}
