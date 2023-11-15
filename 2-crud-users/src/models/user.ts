interface CommonUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface User extends CommonUser {
  password: string;
}

export interface UserEncrypted extends CommonUser {
  passwordHash: string;
}

export interface UserWithoutPassword extends CommonUser {}
