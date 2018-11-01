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
import TestContainer from "./test/containers/TestContainer";



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
    <Route exact path="/home" component={TestContainer}/>
  </div>
);
export default RootComponent;
