import { createStore, applyMiddleware, compose } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';

import DropboxReducers from '../reducers';

let middlewares = applyMiddleware(logger, thunk);

let store = createStore(
  DropboxReducers,
  compose(
    middlewares,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
 );

 export default store;
