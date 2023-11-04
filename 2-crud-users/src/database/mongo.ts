import { MongoClient as Mongo, Db, WithId } from 'mongodb';
import { MongoUser } from '../repositories/mongo-protocols';
import { User } from '../models/user';

export const MongoClient = {
  client: undefined as unknown as Mongo,
  db: undefined as unknown as Db,

  async connect(): Promise<void> {
    const url = process.env.MONGODB_URL || 'mongodb://localhost:27017';
    const username = process.env.MONGODB_USERNAME;
    const password = process.env.MONGODB_PASSWORD;

    this.client = new Mongo(url, { auth: { username, password } });
    this.db = this.client.db('crud-users');

    console.log('Connected to mongodb!');
  },

  createUserFromMongoUser(mongoUser: WithId<MongoUser>): User {
    const { _id, ...rest } = mongoUser;
    return { id: _id.toHexString(), ...rest };
  },
};
