import _ from 'lodash';
import createReducer from '../utils/createReducer';
import types from '../constants/ActionTypes';

function GLOBAL_SEARCH_REQUEST( state, action ) {
	return { ...state, term: action.term };

}

function GLOBAL_SEARCH_SUCCESS( state, action ) {
	let results = action.result.map(r => {
		return Object.assign({}, r.match, { changemakerId: r.changemaker.id });
	});
  return { ...state, results };
}

const GLOBAL_SEARCH_ERROR = _.identity;

const handlers =
{
	[types.GLOBAL_SEARCH_REQUEST]: GLOBAL_SEARCH_REQUEST,
	[types.GLOBAL_SEARCH_SUCCESS]: GLOBAL_SEARCH_SUCCESS,
	[types.GLOBAL_SEARCH_ERROR]: GLOBAL_SEARCH_ERROR
};

const initialSearchState = {
	term: '',
	results: []
};

export default createReducer( initialSearchState, handlers );
