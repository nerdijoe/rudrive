import { combineReducers } from 'redux';

import UserReducer from './UserReducer';

const Dropbox = combineReducers({
  UserReducer,
})

export default Dropbox;
