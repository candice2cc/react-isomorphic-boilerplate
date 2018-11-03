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
import HelloComponent from "./test/components/HelloComponent";
import Hello2Component from "./test/components/Hello2Component";
import Hello3Component from "./test/components/Hello3Component";

// 基于react-loadable 做code split,动态加载component
const LoadableCountContainer = Loadable({
  loader: () => import('./test/containers/CountContainer'),
  loading: () => null,
});


const RootComponent = () => (
  <div>
    <h2>React Test</h2>
    <ul>
      <li>
        <Link to="/">Hello</Link>
      </li>
      <li>
        <Link to="/h2">Hello2</Link>
      </li>
      <li>
        <Link to="/h3">Hello3</Link>
      </li>
      <li>
        <Link to="/count">Count</Link>
      </li>
    </ul>
    <hr/>
    <Route exact path="/" render={() => <Redirect to="/h1"/>}/>
    <Route exact path="/h1" component={HelloComponent}/>
    <Route path="/h2" component={Hello2Component}/>
    <Route path="/h3" component={Hello3Component}/>
    <Route path="/count" component={LoadableCountContainer}/>
  </div>
);
export default RootComponent;
