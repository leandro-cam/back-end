import { UserEncrypted, UserWithoutPassword } from '../models/user';

export const createUserWithoutPasswordFromUserEncrypted = (
  userEncrypted: UserEncrypted,
): UserWithoutPassword => {
  const { passwordHash, ...rest } = userEncrypted;
  return {
    ...rest,
  };
};
