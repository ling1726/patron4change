import types from '../constants/ActionTypes';
import WebAPIUtils from '../utils/WebAPIUtils';
import _ from 'lodash';

const TRIGGER_DELAY = 250;

const [REQUEST, SUCCESS, ERROR] = [
	types.GLOBAL_SEARCH_REQUEST,
	types.GLOBAL_SEARCH_SUCCESS,
	types.GLOBAL_SEARCH_ERROR
];

function send(dispatch, term) {
	WebAPIUtils.search(term).then(
		(result) => dispatch({ result, type: SUCCESS }),
		(error) => dispatch({ error, type: ERROR })
	);
}
const debouncedSend = _.debounce(send, TRIGGER_DELAY);

export function search(term) {

	return dispatch => {
		dispatch({ term, type: REQUEST })
		debouncedSend(dispatch, term);
	};
}
