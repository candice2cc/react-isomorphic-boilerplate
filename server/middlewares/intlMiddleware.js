/**
 * @author Candice
 * @date 2018/11/4 18:07
 */

import {addLocaleData} from 'react-intl';
import en from 'react-intl/locale-data/en';
import zh from 'react-intl/locale-data/zh';
import fs from 'fs';
import path from 'path';

addLocaleData([...en, ...zh]);  // 引入多语言环境的数据
const messages = {};
const localeData = {};
['en', 'zh'].forEach((locale) => {
  localeData[locale] = fs.readFileSync(path.resolve(__dirname, `../../node_modules/react-intl/locale-data/${locale}.js`)).toString();
  messages[locale] = require(`../../locale/${locale}`);
});


export const intlMiddleware = () => {
  return (req, res, next) => {
    // TODO 设置locale
    const locale = 'en';

    res.locals.locale = locale;
    res.locals.localeData = localeData[locale];
    res.locals.messages = messages[locale];
    next();

  };
};
