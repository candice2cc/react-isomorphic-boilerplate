/**
 * @author Candice
 * @date 2018/6/6 18:07
 */
import React from 'react';
import {
  Route,
  Link,
  Redirect,
} from 'react-router-dom';
import Loadable from 'react-loadable';
import TestContainer from "./test/containers/TestContainer";

// 基于react-loadable 做code split,动态加载component
const LoadableHello2Component = Loadable({
  loader: () => import('./test/components/Hello2Component'),
  loading: () => null,
});
const LoadableTestContainer = Loadable({
  loader: () => import('./test/containers/TestContainer'),
  loading: () => null,
});

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
export default RootComponent;
