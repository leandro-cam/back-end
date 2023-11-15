import { ObjectId } from 'mongodb';
import { IGetUserByIdRepository } from '../../controllers/get-user-by-id/protocols';
import { MongoClient } from '../../database/mongo';
import { NotFoundResponse } from '../../helpers/http-error-responses';
import { UserEncrypted } from '../../models/user';
import { MongoUser } from '../mongo-protocols';

export class MongoGetUserByIdRepository implements IGetUserByIdRepository {
  async getUserById(userId: string): Promise<UserEncrypted> {
    const mongoUser = await MongoClient.db
      .collection<MongoUser>('users')
      .findOne({ _id: new ObjectId(userId) });

    if (!mongoUser) {
      throw new NotFoundResponse('User not found');
    }

    return MongoClient.createUserEncryptedFromMongoUser(mongoUser);
  }
}
