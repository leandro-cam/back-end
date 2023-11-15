import { ObjectId } from 'mongodb';
import {
  IUpdateUserRepository,
  UpdateUserAllFieldsBodyEncrypted,
  UpdateUserSomeFieldBodyEncrypted,
} from '../../controllers/update-user/protocols';
import { MongoClient } from '../../database/mongo';
import {
  NotFoundResponse,
  ServerErrorResponse,
} from '../../helpers/http-error-responses';
import { MongoUser } from '../mongo-protocols';

export class MongoUpdateUserRepository implements IUpdateUserRepository {
  async updateUser(
    userId: string,
    body: UpdateUserAllFieldsBodyEncrypted | UpdateUserSomeFieldBodyEncrypted,
  ) {
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
      throw new ServerErrorResponse('User was not updated');
    }

    const mongoUser = await MongoClient.db
      .collection<MongoUser>('users')
      .findOne({ _id: new ObjectId(userId) });

    if (!mongoUser) {
      throw new NotFoundResponse('User not found');
    }

    return MongoClient.createUserEncryptedFromMongoUser(mongoUser);
  }
}
