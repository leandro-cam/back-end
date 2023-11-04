import { User } from '../../models/user';

export type CreateUserBody = Omit<User, 'id'>;
export type CreateUserBodyField = keyof CreateUserBody;

export interface ICreateUserRepository {
  createUser(body: CreateUserBody): Promise<User>;
}
