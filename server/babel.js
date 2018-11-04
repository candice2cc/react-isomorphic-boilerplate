/**
 * @author Candice
 * @date 2018/11/4 16:38
 */
// Provide custom regenerator runtime and core-js
require('babel-polyfill');

// Javascript require hook
require('babel-register')();

require('./server.dev');
