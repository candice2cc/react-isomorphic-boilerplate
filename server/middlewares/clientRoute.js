/**
 * 服务端渲染，复用客户端路由结构
 * @author Candice
 * @date 2018/6/8 11:24
 */
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {StaticRouter} from 'react-router-dom';
import {Provider} from 'react-redux';

import configureStore from '../../client/redux/store';
import RootComponent from '../../client/RootComponent';

const store = configureStore({counter:{count:4}});
// const store = configureStore();

export const clientRoute = (viewName) => {
  return (req, res) => {
    // This context object contains the results of the render
    const context = {};
    const appWidthRouter = (
      <Provider store={store}>
        <StaticRouter
          location={req.url}
          context={context}
        >
          <RootComponent/>
        </StaticRouter>
      </Provider>);
    const html = ReactDOMServer.renderToString(appWidthRouter);
    // context.url will contain the URL to redirect to if a <Redirect> was used
    if (context.url) {
      res.redirect(302, context.url);
    } else {
      res.render(viewName, {
        html,
        preloadedState: JSON.stringify(store.getState()).replace(/</g, '\\u003c')
      });
    }
  };
};
