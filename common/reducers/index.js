import { combineReducers } from 'redux';

import cm from './ChangemakerReducer';
import search from './SearchReducer';
import login from './AuthReducer';
import support from './SupportChangemakerReducer'
import user from './UserReducer';
import status from './StatusUpdateReducer';

export default combineReducers({
  cm,
  search,
	login,
	support,
	user,
  status
});
