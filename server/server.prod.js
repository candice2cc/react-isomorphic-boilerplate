/**
 * @author Candice
 * @date 2018/6/6 18:10
 */

import path from 'path';
import express from 'express';
import exphbs from 'express-handlebars';
import {PORT} from './common/helpers/env_helper';
import {clientRoute} from './middlewares/clientRoute';

const app = express();
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
app.enable('view cache'); //开启模板缓存

//对静态文件统一设置一个虚拟路径，方便nginx做代理
app.use('/public', express.static(path.resolve(__dirname, '../dist/client')));

// 设置路由中间件
app.use(clientRoute('homeProd'));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n==> 🌎  Listening on port ${PORT}. Open up http://localhost:${PORT}/ in your browser.\n`)
});
