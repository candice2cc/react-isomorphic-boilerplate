/**
 * @author Candice
 * @date 2018/6/6 18:10
 */
import express from 'express';
import {PORT} from './common/helpers/env_helper';
import logger from './common/logger';
import useApp from './app';

const app = express();

// common use app
useApp(app);

app.listen(PORT, '0.0.0.0', () => {
  logger.debug(`Listening on port ${PORT}. Open up http://localhost:${PORT}/ in your browser.`);
});
