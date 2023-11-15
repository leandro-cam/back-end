import { User, UserEncrypted } from '../../models/user';
import { PasswordHashType } from '../protocols';

export type UpdateUserAllFieldsBody = Omit<User, 'id' | 'email'>;
export type UpdateUserBodyField = keyof UpdateUserAllFieldsBody;

export type UpdateUserSomeFieldBody = Partial<UpdateUserAllFieldsBody>;

export type UpdateUserAllFieldsBodyEncrypted = Omit<
  UpdateUserAllFieldsBody,
  'password'
> &
  PasswordHashType;

export type UpdateUserSomeFieldBodyEncrypted = Omit<
  UpdateUserSomeFieldBody,
  'password'
> &
  Partial<PasswordHashType>;

export interface IUpdateUserRepository {
  updateUser(
    userId: string,
    body: UpdateUserAllFieldsBody | UpdateUserSomeFieldBody,
  ): Promise<UserEncrypted>;
}
