import { User, UserEncrypted } from '../../models/user';
import { PasswordHashType } from '../protocols';

export type CreateUserBody = Omit<User, 'id'>;
export type CreateUserBodyField = keyof CreateUserBody;

export type CreateUserBodyEncrypted = Omit<CreateUserBody, 'password'> &
  PasswordHashType;

export interface ICreateUserRepository {
  createUser(body: CreateUserBodyEncrypted): Promise<UserEncrypted>;
}
