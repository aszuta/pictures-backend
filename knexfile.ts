// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: `${__dirname}/.env` });
import KnexConfig from './src/config/database';
module.exports = {
  ...KnexConfig,
  connection: {
    ...KnexConfig.connection,
    nestTables: false,
  },
  postProcessResponse: (result) => result,
};
