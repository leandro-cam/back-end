import { ObjectId } from 'mongodb';
import { IGetUserByIdRepository } from '../../controllers/get-user-by-id/protocols';
import { MongoClient } from '../../database/mongo';
import { User } from '../../models/user';
import { MongoUser } from '../mongo-protocols';
import { NotFoundResponse } from '../../helpers/http-error-responses';

export class MongoGetUserByIdRepository implements IGetUserByIdRepository {
  async getUserById(userId: string): Promise<User> {
    const mongoUser = await MongoClient.db
      .collection<MongoUser>('users')
      .findOne({ _id: new ObjectId(userId) });

    if (!mongoUser) {
      throw new NotFoundResponse('User not found');
    }

    return MongoClient.createUserFromMongoUser(mongoUser);
  }
}
