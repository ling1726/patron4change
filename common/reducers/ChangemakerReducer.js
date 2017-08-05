/* eslint brace-style: 0 */

import _ from 'lodash';
import createReducer from '../utils/createReducer';
import types from '../constants/ActionTypes';

function mergeLists(old, more, keySelector) {
	let resultList = old.concat([]);
	let newKeys = more.map(keySelector);
	resultList = resultList.filter(item => !newKeys.includes(keySelector(item)));
	return resultList.concat(more);
}

function mergeInChangemaker(state, newChangemakers) {
	let changemakers = mergeLists(state.changemakers, newChangemakers, _.property('id'));
	return { ...state, changemakers };
}

function READ_ALL_CHANGEMAKERS_REQUEST( state ) { return state; }
function READ_ALL_CHANGEMAKERS_ERROR( state ) { return state; }
function READ_ALL_CHANGEMAKERS_SUCCESS( state, action ) {
	return { ...state, changemaker: action.result };
}

function SUPPORT_CHANGEMAKER( state ) {
	return state;
}

function GET_FEATURED_CHANGEMAKERS_REQUEST (state){return state;}
function GET_FEATURED_CHANGEMAKERS_ERROR (state){return state;}
function GET_FEATURED_CHANGEMAKERS_SUCCESS(state, action){
	let featuredIds = action.result.map(cm => cm.id);
	let newState = mergeInChangemaker(state, action.result)
	newState.featuredChangemakers = featuredIds;
	return newState;
}

function GET_BACKINGS_REQUEST (state){return state;}
function GET_BACKINGS_ERROR (state){return state;}
function GET_BACKINGS_SUCCESS(state, action){
	return { ...state, backings: action.result };
}

function GLOBAL_SEARCH_SUCCESS( state, action ) {
	let resultChangemaker = action.result.map(r => r.changemaker);
	return mergeInChangemaker(state, resultChangemaker);
}

function GET_CHANGEMAKER_BY_ID_REQUEST(state) { return { ...state, loadFinished: false }; }
function GET_CHANGEMAKER_BY_ID_ERROR(state, action) { return { ...state, error: action.error }; }
function GET_CHANGEMAKER_BY_ID_SUCCESS(state, action) {
	// TODO merge to entire list
	return { ...state, changemaker: action.result, loadFinished: true };
}

function SAVE_CHANGEMAKER_PROFILE_REQUEST(state) {return state; }
function SAVE_CHANGEMAKER_PROFILE_ERROR(state) {return state; }
function SAVE_CHANGEMAKER_PROFILE_SUCCESS(state, action) {
	return { ...state, changemaker: action.result };
}

function UPLOAD_VIDEO_SUCCESS(state, action) {
	return { ...state, videoUrl: action.result };
}

const handlers =
{
	[types.READ_ALL_CHANGEMAKERS_REQUEST]: READ_ALL_CHANGEMAKERS_REQUEST,
	[types.READ_ALL_CHANGEMAKERS_SUCCESS]: READ_ALL_CHANGEMAKERS_SUCCESS,
	[types.READ_ALL_CHANGEMAKERS_ERROR]: READ_ALL_CHANGEMAKERS_ERROR,

	[types.SUPPORT_CHANGEMAKER]: SUPPORT_CHANGEMAKER,

	[types.GLOBAL_SEARCH_SUCCESS]: GLOBAL_SEARCH_SUCCESS,

	[types.GET_FEATURED_CHANGEMAKERS_REQUEST]: GET_FEATURED_CHANGEMAKERS_REQUEST,
	[types.GET_FEATURED_CHANGEMAKERS_SUCCESS]: GET_FEATURED_CHANGEMAKERS_SUCCESS,
	[types.GET_FEATURED_CHANGEMAKERS_ERROR]:GET_FEATURED_CHANGEMAKERS_ERROR,

	[types.GET_CHANGEMAKER_BY_ID_REQUEST]: GET_CHANGEMAKER_BY_ID_REQUEST,
	[types.GET_CHANGEMAKER_BY_ID_SUCCESS]: GET_CHANGEMAKER_BY_ID_SUCCESS,
	[types.GET_CHANGEMAKER_BY_ID_ERROR]: GET_CHANGEMAKER_BY_ID_ERROR,

	[types.GET_BACKINGS_REQUEST]: GET_BACKINGS_REQUEST,
	[types.GET_BACKINGS_SUCCESS]: GET_BACKINGS_SUCCESS,
	[types.GET_BACKINGS_ERROR]: GET_BACKINGS_ERROR,

	[types.SAVE_CHANGEMAKER_PROFILE_REQUEST]: SAVE_CHANGEMAKER_PROFILE_REQUEST,
	[types.SAVE_CHANGEMAKER_PROFILE_SUCCESS]: SAVE_CHANGEMAKER_PROFILE_SUCCESS,
	[types.SAVE_CHANGEMAKER_PROFILE_ERROR]: SAVE_CHANGEMAKER_PROFILE_ERROR,

	[types.UPLOAD_VIDEO_REQUEST]: _.identity,
	[types.UPLOAD_VIDEO_SUCCESS]: UPLOAD_VIDEO_SUCCESS,
	[types.UPLOAD_VIDEO_ERROR]: _.identity
}

const initialState = {
	changemaker: {},
	changemakers: [],
	featuredChangemakers: [],
	backings: [],
	updates: [],
	loadFinished: false
};
export default createReducer( initialState, handlers );
