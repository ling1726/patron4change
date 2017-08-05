/* eslint brace-style: 0 */

import createReducer from '../utils/createReducer';
import types from '../constants/ActionTypes';

function GET_UPDATES_REQUEST (state){return state;}
function GET_UPDATES_ERROR (state){return state;}
function GET_UPDATES_SUCCESS(state, action){
	return { ...state, updates: action.result };
}
function CREATE_UPDATE_REQUEST (state){return state;}
function CREATE_UPDATE_ERROR (state){return state;}
function CREATE_UPDATE_SUCCESS(state, action){
	let newUpdate = {
		text: action.model.text,
		title: action.model.title,
		id: action.result.id
	};
	return { ...state, updates: [newUpdate].concat(state.updates) };
}

const handlers =
{
  [types.GET_UPDATES_REQUEST]: GET_UPDATES_REQUEST,
  [types.GET_UPDATES_SUCCESS]: GET_UPDATES_SUCCESS,
  [types.GET_UPDATES_ERROR]:   GET_UPDATES_ERROR,

  [types.CREATE_UPDATE_REQUEST]: CREATE_UPDATE_REQUEST,
  [types.CREATE_UPDATE_SUCCESS]: CREATE_UPDATE_SUCCESS,
  [types.CREATE_UPDATE_ERROR]:   CREATE_UPDATE_ERROR
}

const initialState = {
	updates: []
};
export default createReducer( initialState, handlers );
