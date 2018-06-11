/**
 * @author Candice
 * @date 2018/6/7 15:28
 */
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import rootReducer from '../modules';

import clientMiddleware from '../middleware/clientMiddleware';

const configureStore = function configureStore(preloadedState) {
  return createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(clientMiddleware, thunk, logger),
  );
};
export default configureStore;
