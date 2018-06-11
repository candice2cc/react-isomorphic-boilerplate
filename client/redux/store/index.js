/**
 * @author Candice
 * @date 2018/6/7 15:27
 */
if (process.env.NODE_ENV === 'production') {
  module.exports = require('./configureStore.prod');
} else {
  module.exports = require('./configureStore.dev');
}
