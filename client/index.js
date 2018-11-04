/**
 * 浏览器端入口文件
 * 注：react-hot-loader在production环境时，并不会执行
 * @author Candice
 * @date 2018/6/6 18:06
 */
import {AppContainer} from 'react-hot-loader';
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom';
import 'babel-polyfill';

import {addLocaleData, IntlProvider} from 'react-intl';


import configureStore from './redux/store';
import RootComponent from './RootComponent';


// Grab the state from a global variable injected into the server-generated HTML
const preloadedState = window.__PRELOADED_STATE__;
delete window.__PRELOADED_STATE__;
const store = configureStore(preloadedState);

const locale = window.__LOCALE__;
const messages = window.__MESSAGES__;
addLocaleData(window.ReactIntlLocaleData[locale]);
delete window.__LOCALE__;
delete window.__MESSAGES__;


const render = (Component) => {
  ReactDOM.hydrate(
    <AppContainer>
      <IntlProvider locale={locale} messages={messages}>
        <Provider store={store}>
          <BrowserRouter>
            <Component/>
          </BrowserRouter>
        </Provider>
      </IntlProvider>

    </AppContainer>,
    document.getElementById('Root'),
  );
};

render(RootComponent);

// Hot Module Replacement API
if (module.hot) {
  /* eslint-disable global-require */
  module.hot.accept('./RootComponent', () => {
    const newRoot = require('./RootComponent').default;
    render(newRoot);
  });
}
