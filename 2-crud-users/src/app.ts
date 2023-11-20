import { config } from 'dotenv';
import express from 'express';
import cors, { CorsOptions } from 'cors';
import helmet from 'helmet';
import tokenRoutes from './routes/token-routes';
import userRoutes from './routes/user-routes';

class App {
  private app = express();

  constructor() {
    config({ path: '.env' });

    this.use();
    this.routes();
    this.listen();
  }

  use() {
    this.app.use(express.json());
    this.app.use(helmet());

    this.useCors();
  }

  useCors() {
    const port = process.env.PORT;
    const whiteList = [`http://localhost:${port}`];
    const corsOptions: CorsOptions = {
      origin: function (origin, callback) {
        if (!origin || whiteList.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
    };

    this.app.use(cors(corsOptions));
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
