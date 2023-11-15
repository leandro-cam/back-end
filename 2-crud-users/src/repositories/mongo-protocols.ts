import { UserEncrypted } from '../models/user';

export type MongoUser = Omit<UserEncrypted, 'id'>;
