import database from './database';

const Config: Record<string, any> = {
  host: process.env.HOST || '127.0.0.1',
  port: process.env.PORT || 8000,

  database,
};

export default Config;
