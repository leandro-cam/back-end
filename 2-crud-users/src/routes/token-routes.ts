import { Router } from 'express';
import { CreateTokenController } from '../controllers/create-token/create-token';
import { MongoGetUserByIdRepository } from '../repositories/get-user-by-id/mongo-get-user-by-id';

const router = Router();

router.post('/tokens', async (req, res) => {
  const mongoGetUserByIdRepository = new MongoGetUserByIdRepository();
  const createTokenController = new CreateTokenController(
    mongoGetUserByIdRepository,
  );
  const { statusCode, body } = await createTokenController.handle({
    body: req.body,
  });

  res.status(statusCode).send(body);
});

export default router;
