import { Db, MongoClient as Mongo, WithId } from 'mongodb';
import { UserEncrypted } from '../models/user';
import { MongoUser } from '../repositories/mongo-protocols';

export class MongoClient {
  private static _db: Db | null = null;

  static get db(): Db {
    if (!MongoClient._db) {
      const url = process.env.MONGODB_URL || 'mongodb://localhost:27017';
      const username = process.env.MONGODB_USERNAME;
      const password = process.env.MONGODB_PASSWORD;

      const client = new Mongo(url, { auth: { username, password } });
      MongoClient._db = client.db('crud-users');

      console.log('Connected to mongodb!');
    }

    return MongoClient._db;
  }

  static createUserEncryptedFromMongoUser(
    mongoUser: WithId<MongoUser>,
  ): UserEncrypted {
    const { _id, ...rest } = mongoUser;
    return { id: _id.toHexString(), ...rest };
  }
}
