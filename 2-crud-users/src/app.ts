import { config } from 'dotenv';
import express from 'express';
import tokenRoutes from './routes/token-routes';
import userRoutes from './routes/user-routes';

class App {
  private app = express();

  constructor() {
    config();

    this.use();
    this.routes();
    this.listen();
  }

  use() {
    this.app.use(express.json());
    // this.app.use(cors(corsOptions));
    // this.app.use(helmet());
  }

  routes() {
    this.app.use('/', userRoutes);
    this.app.use('/', tokenRoutes);
  }

  listen() {
    const port = process.env.PORT;
    this.app.listen(port, () => console.log(`Listening on port ${port}!`));
  }
}

new App();
