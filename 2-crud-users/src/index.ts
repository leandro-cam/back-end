import express from 'express';
import { config } from 'dotenv';
import { MongoClient } from './database/mongo';
import { MongoGetUsersRepository } from './repositories/get-users/mongo-get-users';
import { GetUsersController } from './controllers/get-users/get-users';
import { MongoCreateUserRepository } from './repositories/create-user/mongo-create-user';
import { CreateUserController } from './controllers/create-user/create-user';
import { MongoDeleteUserRepository } from './repositories/delete-user/mongo-delete-user';
import { DeleteUserController } from './controllers/delete-user/delete-user';
import { MongoUpdateUserRepository } from './repositories/update-user/mongo-update-user';
import { UpdateUserSomeFieldController } from './controllers/update-user/update-user-some-field';
import { UpdateUserAllFieldsController } from './controllers/update-user/update-user-all-fields';
import { MongoGetUserByIdRepository } from './repositories/get-user-by-id/mongo-get-user-by-id';
import { GetUserByIdController } from './controllers/get-user-by-id/get-user-by-id';

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

  app.get('/users/:userId', async (req, res) => {
    const mongoGetUserByIdRepository = new MongoGetUserByIdRepository();
    const getUserByIdController = new GetUserByIdController(
      mongoGetUserByIdRepository,
    );
    const { statusCode, body } = await getUserByIdController.handle({
      params: req.params,
    });

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

  app.patch('/users/:userId', async (req, res) => {
    const mongoUpdateUserRepository = new MongoUpdateUserRepository();
    const updateUserSomeFieldController = new UpdateUserSomeFieldController(
      mongoUpdateUserRepository,
    );
    const { statusCode, body } = await updateUserSomeFieldController.handle({
      params: req.params,
      body: req.body,
    });

    res.status(statusCode).send(body);
  });

  app.put('/users/:userId', async (req, res) => {
    const mongoUpdateUserRepository = new MongoUpdateUserRepository();
    const updateUserAllFieldsController = new UpdateUserAllFieldsController(
      mongoUpdateUserRepository,
    );
    const { statusCode, body } = await updateUserAllFieldsController.handle({
      params: req.params,
      body: req.body,
    });

    res.status(statusCode).send(body);
  });

  app.listen(port, () => console.log(`Listening on port ${port}!`));
};

main();
