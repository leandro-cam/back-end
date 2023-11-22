import { Router } from 'express';
import { CreateUserController } from '../controllers/create-user/create-user';
import { DeleteUserController } from '../controllers/delete-user/delete-user';
import { GetUserByIdController } from '../controllers/get-user-by-id/get-user-by-id';
import { GetUsersController } from '../controllers/get-users/get-users';
import { UpdateUserAllFieldsController } from '../controllers/update-user/update-user-all-fields';
import { UpdateUserSomeFieldController } from '../controllers/update-user/update-user-some-field';
import { MongoCreateUserRepository } from '../repositories/create-user/mongo-create-user';
import { MongoDeleteUserRepository } from '../repositories/delete-user/mongo-delete-user';
import { MongoGetUserByIdRepository } from '../repositories/get-user-by-id/mongo-get-user-by-id';
import { MongoGetUsersRepository } from '../repositories/get-users/mongo-get-users';
import { MongoUpdateUserRepository } from '../repositories/update-user/mongo-update-user';
import { LoginRequiredMiddleware } from '../middlewares/login-required';
import { isSameUserMiddleware } from '../middlewares/is-same-user';

const router = Router();

const mongoGetUserByIdRepository = new MongoGetUserByIdRepository();
const loginRequiredMiddleware = new LoginRequiredMiddleware(
  mongoGetUserByIdRepository,
);

router.get('/users', async (_, res) => {
  const mongoGetUsersRepository = new MongoGetUsersRepository();
  const getUsersController = new GetUsersController(mongoGetUsersRepository);
  const { statusCode, body } = await getUsersController.handle();

  res.status(statusCode).send(body);
});

router.get('/users/:userId', async (req, res) => {
  const getUserByIdController = new GetUserByIdController(
    mongoGetUserByIdRepository,
  );
  const { statusCode, body } = await getUserByIdController.handle({
    params: req.params,
  });

  res.status(statusCode).send(body);
});

router.post('/users', async (req, res) => {
  const mongoCreateUserRepository = new MongoCreateUserRepository();
  const createUserController = new CreateUserController(
    mongoCreateUserRepository,
  );
  const { statusCode, body } = await createUserController.handle({
    body: req.body,
  });

  res.status(statusCode).send(body);
});

router.delete(
  '/users/:userId',
  loginRequiredMiddleware.handle.bind(loginRequiredMiddleware),
  isSameUserMiddleware,
  async (req, res) => {
    const mongoDeleteUserRepository = new MongoDeleteUserRepository();
    const deleteUserController = new DeleteUserController(
      mongoDeleteUserRepository,
    );
    const { statusCode, body } = await deleteUserController.handle({
      params: req.params,
    });

    res.status(statusCode).send(body);
  },
);

router.patch(
  '/users/:userId',
  loginRequiredMiddleware.handle.bind(loginRequiredMiddleware),
  isSameUserMiddleware,
  async (req, res) => {
    const mongoUpdateUserRepository = new MongoUpdateUserRepository();
    const updateUserSomeFieldController = new UpdateUserSomeFieldController(
      mongoUpdateUserRepository,
    );
    const { statusCode, body } = await updateUserSomeFieldController.handle({
      params: req.params,
      body: req.body,
    });

    res.status(statusCode).send(body);
  },
);

router.put(
  '/users/:userId',
  loginRequiredMiddleware.handle.bind(loginRequiredMiddleware),
  isSameUserMiddleware,
  async (req, res) => {
    const mongoUpdateUserRepository = new MongoUpdateUserRepository();
    const updateUserAllFieldsController = new UpdateUserAllFieldsController(
      mongoUpdateUserRepository,
    );
    const { statusCode, body } = await updateUserAllFieldsController.handle({
      params: req.params,
      body: req.body,
    });

    res.status(statusCode).send(body);
  },
);

export default router;
