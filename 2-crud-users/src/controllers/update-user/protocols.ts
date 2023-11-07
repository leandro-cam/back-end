import { User } from '../../models/user';

export type UpdateUserBody = Partial<Omit<User, 'id' | 'email'>>;
export type UpdateUserBodyField = keyof UpdateUserBody;

export interface IUpdateUserRepository {
  updateUser(userId: string, body: UpdateUserBody): Promise<User>;
}
