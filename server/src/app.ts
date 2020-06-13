import express from 'express';
import cors from 'cors';
import { v1 } from './routes';
import { errors } from "celebrate";
import swaggerUi from 'swagger-ui-express'
import * as swaggerDocument from './swagger.json'
import path from 'path';
import { config } from "dotenv";
import { getEnvPath } from './utils/common';

const NODE_ENV = process.env.NODE_ENV

config({
  path: path.resolve(__dirname, getEnvPath(String(NODE_ENV)))
});
class AppController {
  express: any
  constructor(){
    this.express = express();
    this.middlewares();
    this.routes()
  }

  middlewares(){
    this.express.use(cors())
      .use(express.json());
  }

  routes(){
    this.express.use('/v1', v1)
      .use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
      .use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')))
      .use(errors());
  }
}

export default new AppController().express