import knex from 'knex';
import path from 'path';
import { config } from "dotenv";
import { getEnvPath } from '../util/common';

const NODE_ENV = process.env.NODE_ENV

config({
  path: path.resolve(__dirname,'..', getEnvPath(String(NODE_ENV)))
});

const env = process.env;

const connection = knex(
  NODE_ENV !== 'prod' 
  ? {
    client: 'sqlite3',
    connection: {
      filename: path.resolve(__dirname, String(env.DATABASE))
    },
    useNullAsDefault: true
  } 
  : {
    client: process.env.CLIENT,
    connection: {
      host: env.HOST,
      user: env.USER,
      password: env.PASSWORD,
      database: env.DATABASE
    }
   }
)

export default connection;