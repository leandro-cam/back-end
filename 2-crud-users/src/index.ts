import express from 'express';
import { config } from 'dotenv';
import { MongoClient } from './database/mongo';
import { MongoGetUsersRepository } from './repositories/get-users/mongo-get-users';
import { GetUsersController } from './controllers/get-users/get-users';
import { MongoCreateUserRepository } from './repositories/create-user/mongo-create-user';
import { CreateUserController } from './controllers/create-user/create-user';
import { MongoDeleteUserRepository } from './repositories/delete-user/mongo-delete-user';
import { DeleteUserController } from './controllers/delete-user/delete-user';

const main = async () => {
  config();

  const app = express();
  const port = process.env.PORT || 8000;

  app.use(express.json());

  await MongoClient.connect();

  app.get('/users', async (_, res) => {
    const mongoGetUsersRepository = new MongoGetUsersRepository();
    const getUsersController = new GetUsersController(mongoGetUsersRepository);
    const { statusCode, body } = await getUsersController.handle();

    res.status(statusCode).send(body);
  });

  app.post('/users', async (req, res) => {
    const mongoCreateUserRepository = new MongoCreateUserRepository();
    const createUserController = new CreateUserController(
      mongoCreateUserRepository,
    );
    const { statusCode, body } = await createUserController.handle({
      body: req.body,
    });

    res.status(statusCode).send(body);
  });

  app.delete('/users/:userId', async (req, res) => {
    const mongoDeleteUserRepository = new MongoDeleteUserRepository();
    const deleteUserController = new DeleteUserController(
      mongoDeleteUserRepository,
    );
    const { statusCode, body } = await deleteUserController.handle({
      params: req.params,
    });

    res.status(statusCode).send(body);
  });

  app.listen(port, () => console.log(`Listening on port ${port}!`));
};

main();
