import { IGetUsersRepository } from '../../controllers/get-users/protocols';
import { MongoClient } from '../../database/mongo';
import { UserEncrypted } from '../../models/user';
import { MongoUser } from '../mongo-protocols';

export class MongoGetUsersRepository implements IGetUsersRepository {
  async getUsers(): Promise<UserEncrypted[]> {
    const mongoUsers = await MongoClient.db
      .collection<MongoUser>('users')
      .find({})
      .toArray();

    return mongoUsers.map(MongoClient.createUserEncryptedFromMongoUser);
  }
}
