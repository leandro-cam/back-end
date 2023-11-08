import { ObjectId } from 'mongodb';
import {
  IUpdateUserRepository,
  UpdateUserBody,
} from '../../controllers/update-user/protocols';
import { MongoClient } from '../../database/mongo';
import { MongoUser } from '../mongo-protocols';

export class MongoUpdateUserRepository implements IUpdateUserRepository {
  async updateUser(userId: string, body: UpdateUserBody) {
    const { modifiedCount } = await MongoClient.db
      .collection<MongoUser>('users')
      .updateOne(
        { _id: new ObjectId(userId) },
        {
          $set: {
            ...body,
          },
        },
      );

    if (!modifiedCount) {
      throw new Error('User was not updated');
    }

    const mongoUser = await MongoClient.db
      .collection<MongoUser>('users')
      .findOne({ _id: new ObjectId(userId) });

    if (!mongoUser) {
      throw new Error('User not found');
    }

    return MongoClient.createUserFromMongoUser(mongoUser);
  }
}
