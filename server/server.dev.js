/**
 * @author Candice
 * @date 2018/6/6 18:10
 */

import express from 'express';
import fs from 'fs';
import path from 'path';
import exphbs from 'express-handlebars';

import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from '../tools/webpack.config.dev';

import {PORT} from './common/helpers/env_helper';
import logger from './common/logger';
import useApp from './app';
import configureStore from '../client/redux/store';

const store = configureStore({counter: {count: 4}});
// const store = configureStore();

const app = express();
const compiler = webpack(webpackConfig);

// Webpack hook event to write html file into `/views/dev` from `/views/tpl` due to server render
compiler.plugin('emit', (compilation, callback) => {
  const assets = compilation.assets;
  let file, data;
  Object.keys(assets).forEach(key => {
    if (key.match(/\.hbs/)) {
      file = path.resolve(__dirname, key);
      data = assets[key].source();
      fs.writeFileSync(file, data);
    }
  });
  callback();
});

app.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: webpackConfig.output.publicPath,
}));

app.use(webpackHotMiddleware(compiler, {
  path: '/__webpack_hmr',
}));

// 设置页面模板
app.set('views', path.resolve(__dirname, '../dist/server'));
app.engine('.hbs', exphbs({
  extname: '.hbs',
}));
app.set('view engine', '.hbs');

// common use app
useApp(app);

app.use((req, res) => {
  res.render('homeDev', {
    html: null,
    preloadedState: JSON.stringify(store.getState()).replace(/</g, '\\u003c')
  })
});

// 无需设置静态文件，使用webpackDevMiddleware publicPath

app.listen(PORT, '0.0.0.0', () => {
  logger.debug(`Listening on port ${PORT}. Open up http://localhost:${PORT}/ in your browser.`);
});
