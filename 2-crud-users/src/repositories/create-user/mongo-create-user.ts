import {
  CreateUserBody,
  ICreateUserRepository,
} from '../../controllers/create-user/protocols';
import { MongoClient } from '../../database/mongo';
import { ServerErrorResponse } from '../../helpers/http-error-responses';
import { User } from '../../models/user';
import { MongoUser } from '../mongo-protocols';

export class MongoCreateUserRepository implements ICreateUserRepository {
  async createUser(body: CreateUserBody): Promise<User> {
    const { insertedId } = await MongoClient.db
      .collection('users')
      .insertOne(body);

    const mongoUser = await MongoClient.db
      .collection<MongoUser>('users')
      .findOne({ _id: insertedId });

    if (!mongoUser) {
      throw new ServerErrorResponse('User was not created. Please, try again');
    }

    return MongoClient.createUserFromMongoUser(mongoUser);
  }
}
