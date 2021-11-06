import { createServer } from './server';
import { logger } from './utils';

const initialise = async () => {
  await createServer();
};

initialise().catch(err => logger.fatal({ msg: "Could not start server", err }));
