import { ObjectId } from 'mongodb';
import {
  IUpdateUserRepository,
  UpdateUserAllFieldsBody,
  UpdateUserSomeFieldBody,
} from '../../controllers/update-user/protocols';
import { MongoClient } from '../../database/mongo';
import { MongoUser } from '../mongo-protocols';
import {
  NotFoundResponse,
  ServerErrorResponse,
} from '../../helpers/http-error-responses';

export class MongoUpdateUserRepository implements IUpdateUserRepository {
  async updateUser(
    userId: string,
    body: UpdateUserAllFieldsBody | UpdateUserSomeFieldBody,
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
