import database from './database';
import { multerOptions } from './multerOptions';

const Config: Record<string, any> = {
  host: process.env.HOST || '127.0.0.1',
  port: process.env.PORT || 8000,

  database,
  multerOptions,
};

export default Config;
