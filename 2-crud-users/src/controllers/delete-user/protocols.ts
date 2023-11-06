import { User } from '../../models/user';

export interface IDeleteUserRepository {
  deleteUser(userId: string): Promise<User>;
}
