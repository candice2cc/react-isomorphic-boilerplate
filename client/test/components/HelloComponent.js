/**
 * @author Candice
 * @date 2018/6/7 15:33
 */

import React from 'react';
import CSSModules from 'react-css-modules';

import modalImg from '../img/modal.svg';
import styles from '../sass/HelloComponent.scss';

const HelloComponent = () => (
  <div styleName="hello">
    <h2>Hello, Component!!!123</h2>
    <img src={modalImg}/>
  </div>
);

export default CSSModules(HelloComponent, styles);
