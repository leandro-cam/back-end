import { User } from '../../models/user';

export type CreateTokenBody = Omit<User, 'firstName' | 'lastName'>;
export type CreateTokenBodyField = keyof CreateTokenBody;
