import { config } from 'dotenv';
import express from 'express';
import { MongoClient } from './database/mongo';
import userRoutes from './routes/user-routes';

class App {
  private app = express();

  constructor() {
    config();

    this.database();

    this.use();
    this.routes();
    this.listen();
  }

  async database() {
    await MongoClient.connect();
  }

  use() {
    this.app.use(express.json());
    // this.app.use(cors(corsOptions));
    // this.app.use(helmet());
  }

  routes() {
    this.app.use('/', userRoutes);
  }

  listen() {
    const port = process.env.PORT;
    this.app.listen(port, () => console.log(`Listening on port ${port}!`));
  }
}

new App();
