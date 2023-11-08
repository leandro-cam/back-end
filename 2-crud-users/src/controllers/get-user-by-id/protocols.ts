import { User } from '../../models/user';

export interface IGetUserByIdRepository {
  getUserById(userId: string): Promise<User>;
}
