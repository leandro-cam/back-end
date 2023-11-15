import { IGetUsersRepository } from '../../controllers/get-users/protocols';
import { MongoClient } from '../../database/mongo';
import { User } from '../../models/user';
import { MongoUser } from '../mongo-protocols';

export class MongoGetUsersRepository implements IGetUsersRepository {
  async getUsers(): Promise<User[]> {
    const mongoUsers = await MongoClient.db
      .collection<MongoUser>('users')
      .find({})
      .toArray();

    return mongoUsers.map(MongoClient.createUserEncryptedFromMongoUser);
  }
}
