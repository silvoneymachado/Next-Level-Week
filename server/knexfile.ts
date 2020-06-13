import path from 'path';
import { config } from "dotenv";
import { getEnvPath } from './src/utils/common';

const NODE_ENV = process.env.NODE_ENV

config({
  path: path.resolve(__dirname, 'src', getEnvPath(String(NODE_ENV)))
});

const seedsDir = NODE_ENV === 'test' 
  ? path.resolve(__dirname, '__tests__', 'seeds')
  : path.resolve(__dirname, 'src', 'database', 'seeds')

module.exports = {
  client: 'sqlite3',
  connection: {
    filename: path.resolve(__dirname, 'src', 'database', String(process.env.DATABASE))
  },
  migrations: {
    directory:path.resolve(__dirname, 'src', 'database', 'migrations')
  },
  seeds: {
    directory: seedsDir
  },
  useNullAsDefault: true
}
