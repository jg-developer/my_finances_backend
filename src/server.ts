import 'reflect-metadata';

import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';
import * as dotenvFlow from 'dotenv-flow';

import routes from './routes';
import { connectToDb } from './database';
import HttpException from './error/AppError';

const env = process.env.NODE_ENV || 'development';
dotenvFlow.config({ node_env: env });

const app = express();
(async () => {
  await connectToDb();
  app.use(cors());
  app.use(express.json());
  app.use('/api', routes);

  // express-async-errors
  app.use(
    (
      err: HttpException,
      _request: Request,
      response: Response,
      _: NextFunction,
    ) => {
      const status = err.status || 500;
      const message = err.message || 'Something went wrong';
      const displayMessage = err.displayMessage || 'Erro';
      response.status(status).send({
        status,
        message,
        displayMessage,
      });
    },
  );

  app.listen(process.env.PORT || 3333, () => {
    console.log('Server started on port 3333');
  });
})();
