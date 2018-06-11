/**
 * @author Candice
 * @date 2018/6/6 18:10
 */
// Provide custom regenerator runtime and core-js
require('babel-polyfill');
// // Node babel source map support
require('source-map-support').install();

// Javascript require hook
require('babel-register')();
// Css require hook
require('css-modules-require-hook')({
  extensions: ['.scss'],
  preprocessCss: (data, filename) =>
    require('node-sass').renderSync({
      data,
      file: filename
    }).css,
  camelCase: true,
  generateScopedName: '[local]___[hash:base64:5]'
});


// Image require hook
require('asset-require-hook')({
  name: '/public/img/[name].[ext]',
  extensions: ['jpg', 'png', 'gif', 'webp','svg'],
});


const express = require('express');
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const exphbs = require('express-handlebars');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('../tools/webpack.config.dev');
const {PORT} = require('./common/helpers/env_helper');
const {clientRoute} = require('./middlewares/clientRoute');

const app = express();
const port = PORT;
const compiler = webpack(webpackConfig);

// Webpack hook event to write html file into `/views/dev` from `/views/tpl` due to server render
compiler.plugin('emit', (compilation, callback) => {
  const assets = compilation.assets;
  let file, data;
  Object.keys(assets).forEach(key => {
    if (key.match(/\.hbs/)) {
      file = path.resolve(__dirname,key);
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
  // helpers: {
  //   section: function (name, options) {
  //     if (!this._sections) this._sections = {};
  //     this._sections[name] = options.fn(this);
  //     return null;
  //   },
  // },
}));
app.set('view engine', '.hbs');

// 设置路由中间件
app.use(clientRoute('homeDev'));

// 无需设置静态文件，使用webpackDevMiddleware publicPath

app.listen(port, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.info(`\n==> 🌎  Listening on port ${PORT}. Open up http://localhost:${PORT}/ in your browser.\n`);
  }
});
