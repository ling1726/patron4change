import { createStore, applyMiddleware, compose } from 'redux';
import promiseMiddleware from '../middleware/PromiseMiddleware';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import combinedReducers from '../reducers';

window.$REDUX_DEVTOOL = false;

const logger = createLogger({
  level: 'info',
  collapsed: true,
  // use for debugging to trace only the essential actions
  predicate: (getState, action) => !action.no_log
});

const enhancer = compose(
	applyMiddleware( promiseMiddleware, thunk, logger )
)

export default function configureStore( initialState ) {

  const store = createStore( combinedReducers, initialState, enhancer);

  if (module.hot) {

  	module.hot.accept('../reducers', () => {
  	  const nextRootReducer = require('../reducers');
  	  store.replaceReducer(nextRootReducer);
  	});
  }

  return store;
}
