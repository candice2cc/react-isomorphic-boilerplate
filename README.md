### react同构直出方案

#### 同构直出的好处
1. SEO，让搜索引擎更容易读取页面内容
2. 首屏渲染速度更快（重点），无需等待js文件下载执行的过程
3. 更易于维护，服务端和客户端可以共享某些代码

#### 关键技术栈
- react v16
- react-router-dom v4
- redux v4
- webpack v3
- express v4
- react-loadable v5
- eslint
- prettier

#### 主要问题
1. 如何实现组件同构？
2. 如何保持前后端应用状态一致？
3. 如何解决前后端路由匹配问题？
4. 如何处理服务端对静态资源的依赖？
5. 如何配置两套不同的环境（开发环境和产品环境）？
6. 如何划分更合理的项目目录结构？

#### 同构方案
React本身是以`Virtual DOM`的形式存储在内存中。
对于客户端，同构`ReactDOM.render`方法把`Virtual DOM`转换成真实DOM最后渲染到浏览器界面。
```javascript
import ReactDOM from 'react-dom';
import App from './App'
ReactDOM.render(
    <App/>,
    document.getElementById('Root'),
);
```
对于服务端，通过`ReactDOMServer.renderToString`方法把Virtual DOM转换成HTML字符串返回给客户端，从而达到服务端渲染的目的。
```javascript
import ReactDOMServer from 'react-dom/server';
import App from './App'
const html = ReactDOMServer.renderToString(<App/>);
res.render('home', {html:html});
```

#### 状态管理
我们使用Redux来管理应用数据状态。当进行服务端渲染时，创建store实例后，将store的初始状态回传给客户端，客户端拿到初始状态后，把它作为预加载状态来创建store实例。这样能够保证客户端和服务端生成的markup是一致的。
**服务端**
```javascript
import { renderToString } from 'react-dom/server'
​
function handleRender(req, res) {
  // Create a new Redux store instance
  const store = createStore(counterApp)
​
  // Render the component to a string
  const html = renderToString(
    <Provider store={store}>
      <App />
    </Provider>
  )
​
  // Grab the initial state from our Redux store
  const preloadedState = store.getState()
​
  res.render('home', {
    html,
    preloadedState: JSON.stringify(store.getState()).replace(/</g, '\\u003c')
  });
}
```
**handlebars**
```handlebars
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>React Isomorphic Boilerplate</title>
</head>
<body>
<div id="Root">{{{html}}}</div>

<script>
  window.__PRELOADED_STATE__ = {{{preloadedState}}};
</script>
</body>
</html>

```
**客户端**
```javascript
import React from 'react'
import { hydrate } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import App from './containers/App'
import counterApp from './reducers'
​
// Grab the state from a global variable injected into the server-generated HTML
const preloadedState = window.__PRELOADED_STATE__
​
// Allow the passed state to be garbage-collected
delete window.__PRELOADED_STATE__
​
// Create Redux store with initial state
const store = createStore(counterApp, preloadedState)
​
hydrate(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```


#### 路由方案
服务端渲染时，使用无状态的`<StaticRouter>`替代`<BrowserRouter>`。
当客户端使用`<Redirect>`时，浏览器的history状态会发生改变，我们会跳转到新的页面。在服务端，我们通过`context`属性获得服务端渲染的结果。如果`context.url`有值，则认为应用发生了跳转，此时服务端应该进行跳转操作。同时，我们也可以使用`context`跟踪跳转状态码。
**RootComponent**
```javascript
import React from 'react';
import {
  Route,
  Link,
  Redirect,
} from 'react-router-dom';

const RootComponent = () => (
  <div>
    <h2>React Test</h2>
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/test">Test</Link>
      </li>
      <li>
        <Link to="/h2">Hello2</Link>
      </li>
    </ul>
    <hr/>
    <Route exact path="/" render={() => <Redirect to="/home"/>}/>
    <Route exact path="/home" component={TestContainer}/>}/>
    <Route path="/test" component={LoadableTestContainer}/>
    <Route path="/h2" component={LoadableHello2Component}/>
  </div>
);
```
**客户端**
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom';
import configureStore from './redux/store';
import RootComponent from './RootComponent';

const render = (Component) => {
  ReactDOM.hydrate(
	  <Provider store={store}>
	     <BrowserRouter>
	       <Component/>
	     </BrowserRouter>
	   </Provider>
    document.getElementById('Root'),
  );
};

render(RootComponent);
```
**服务端**
```javascript
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
```

#### 静态资源处理
客户端代码使用webpack打包已经很常见了，我们可以把jsx语法、sass文件、图片等等资源，最终通过webpack配合各种loader、plugin打包成相应的浏览器端兼容的代码。
而在服务端，不支持import、jsx这种语法，并且无法识别对css、image资源后缀的模块引用，那么应该怎么处理这些静态资源呢？
##### 开发环境
为了开发体验起见，最好是一个在线执行环境，那么在Node Web服务开始前，我们需要准备以下操作：
- 首先引入babel-polyfill这个库来提供regenerator运行时和core-js来模拟全功能ES6环境。
- 引入babel-register，这是一个require钩子，会自动对require命令所加载的js文件进行实时转码，需要注意的是，这个库只适用于开发环境。
- 引入css-modules-require-hook，同样是钩子，只针对样式文件，由于我们采用的是CSS Modules方案，并且使用SASS来书写代码，所以需要node-sass这个前置编译器来识别扩展名为.scss的文件，通过这个钩子，自动提取className哈希字符注入到服务端的React组件中。
- 引入asset-require-hook，来识别图片资源。
```javascript
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

```


##### 产品环境
在产品环境，我们使用webpack分别对客户端和服务端代码进行打包。
服务端代码打包，需要指定运行环境为node，并且提供polyfill，设置 \__filename 和 __dirname为true。
由于是采用CSS Modules，服务端只需获取className，而无需加载样式代码，所以要使用css-loader/locals替代css-loader加载样式文件。
使用externals处理不打包的依赖库，通过引入`webpack-node-externals`库，将忽略node_modules下的依赖库。
设置libraryTarget值为commonjs2，bundle最终会以module.exports导出，适应于Node环境运行。
```javascript
 {
    name: 'server',
    context: path.resolve(__dirname, '..'),
    entry: {
      app: './server/server.prod',
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, '../dist/server'),
      chunkFilename: 'chunk.[name].js',
      libraryTarget: 'commonjs2',
      publicPath: '/public/'
    },
    target: 'node',
    node: {
      __filename: true,
      __dirname: true
    },
    externals: [nodeExternals()],
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              forceEnv: 'server',
            }
          }
        },
        {
          test: /\.scss$/,
          use: [
            {
              loader: 'css-loader/locals', // translates CSS into CommonJS
              options: {
                modules: true,
                importLoaders: 1,
                // localIdentName: '[path]___[name]__[local]___[hash:base64:5]',
                localIdentName: '[local]___[hash:base64:5]'
              }
            },
            {
              loader: 'sass-loader' // compiles Sass to CSS
            }
          ]
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: 'img/[name].[ext]?[hash:5]'
              }
            }
          ]
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.json', '.scss'],
    },
    plugins: [
      new CleanWebpackPlugin([path.resolve(__dirname, '../dist/server')], {root: path.join(__dirname, '../')}),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production')
        },
      }),
    ]
  }
```

#### 动态加载
对于大型的Web应用来，所有代码打包到一个文件不是一种优雅的做法。用户使用应用时，并不想下载整个应用的代码。通过`webpack`,`babel-plugin-syntax-dynamic-import`, 和` react-loadable`，可以非常灵活的实现动态加载。
服务端渲染需要使用依赖` babel-plugin-import-inspector`。
**.bashrc**
```
      "plugins": [
        "syntax-dynamic-import",
        ["import-inspector", {
          "serverSideRequirePath": true,
          "webpackRequireWeakId": true
        }]
      ]
```
**eg.**
```javascript
import Loadable from 'react-loadable';
import Loading from './Loading';

const LoadableComponent = Loadable({
  loader: () => import('./Dashboard'),
  loading: Loading,
})

export default class LoadableDashboard extends React.Component {
  render() {
    return <LoadableComponent />;
  }
}
```

#### 优化
- 提取第三方库，命名vendor
- 所有的js均以`chunkhash`方式命名
- 所有的css均以`contenthash`方式命名
- 基于`babel-runtime`模拟ES6环境，在.bashrc中配置需要引入的模块
- 提取公共模块，manifest文件起过渡作用
- 图片、字体库、视频类文件均带hash后缀
```javascript
{
   test: /\.(png|svg|jpg|jpeg|gif)$/,
   use: [
     {
       loader: 'file-loader',
       options: {
         name: 'img/[name].[ext]?[hash:5]',
       },

     },
   ],

 },
```

#### 部署方案
对于客户端代码，将全部静态资源上传至CDN服务器；
对于服务端代码，则采用pm2部署。

#### 其他
##### 提升开发体验
对于客户端代码，可以使用Hot Module Replacement技术，并配合webpack-dev-middleware，webpack-hot-middleware两个中间件，与传统的BrowserSync不同的是，它可以使我们不用通过刷新浏览器的方式，让js和css改动实时更新反馈至浏览器界面中。
```javascript
app.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: webpackConfig.output.publicPath,
}));

app.use(webpackHotMiddleware(compiler, {
  path: '/__webpack_hmr',
}));
```
对于服务端代码，则使用nodemon监听代码改动，来自动重启node服务器。
```bash
nodemon ./server/server.dev.js --watch server --watch tools
```
##### 代码风格约束
使用ESLint并配置ESLint规则，结合prettier、eslint-plugin-prettier、eslint-config-prettier来检查和格式化代码问题。


##### 日志记录
TODO
