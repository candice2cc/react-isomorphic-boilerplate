/**
 * @author Candice
 * @date 2018/6/7 15:33
 */

import React from 'react';
import testImg from '../img/test.jpg';
import smImg from '../img/test_sm.png';

const Hello2Component = () => (
  <div>
    <h2>Hello, Component2</h2>
    <img src={smImg}/>
    <img src={testImg}/>
  </div>
);

export default Hello2Component;
