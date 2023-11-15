import { User, UserEncrypted } from '../../models/user';

export interface IGetUserByIdRepository {
  getUserById(userId: string): Promise<UserEncrypted>;
}
