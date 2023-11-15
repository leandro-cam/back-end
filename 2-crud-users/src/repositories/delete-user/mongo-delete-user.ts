import { ObjectId } from 'mongodb';
import { IDeleteUserRepository } from '../../controllers/delete-user/protocols';
import { MongoClient } from '../../database/mongo';
import {
  NotFoundResponse,
  ServerErrorResponse,
} from '../../helpers/http-error-responses';
import { User, UserEncrypted } from '../../models/user';
import { MongoUser } from '../mongo-protocols';

export class MongoDeleteUserRepository implements IDeleteUserRepository {
  async deleteUser(userId: string): Promise<UserEncrypted> {
    const mongoUser = await MongoClient.db
      .collection<MongoUser>('users')
      .findOne({ _id: new ObjectId(userId) });

    if (!mongoUser) {
      throw new NotFoundResponse('User not found');
    }

    const { deletedCount } = await MongoClient.db
      .collection('users')
      .deleteOne({ _id: new ObjectId(userId) });

    if (!deletedCount) {
      throw new ServerErrorResponse('User was not deleted');
    }

    return MongoClient.createUserEncryptedFromMongoUser(mongoUser);
  }
}
