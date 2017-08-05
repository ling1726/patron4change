import createReducer from '../utils/createReducer';
import types from '../constants/ActionTypes';


function GET_USER_BY_ID_REQUEST(state){
	return state;
}

function GET_USER_BY_ID_ERROR(state){
	return state;
}

function GET_USER_BY_ID_SUCCESS(state, action){
	if(action.result.birthday){
		action.result.birthday = action.result.birthday.slice(0,10)
	}

	return {
		...state,
		user: action.result,
		profileUpdate: null
	}
}

function UPDATE_USER_REQUEST(state){
	return state;
}

function UPDATE_USER_SUCCESS(state, action){
	if(action.result.birthday){
		action.result.birthday = action.result.birthday.slice(0,10)
	}
	if(action.result.incorrectData){
		localStorage.incorrectData = 1
	}else{
		localStorage.incorrectData = 0
	}

	return {
		...state,
		user: action.result,
		profileUpdate: true
	}
}

function UPDATE_USER_ERROR(state){
	return {
		...state,
		profileUpdate: false
	};
}

const handlers =
	{
		[types.GET_USER_BY_ID_REQUEST]: GET_USER_BY_ID_REQUEST,
		[types.GET_USER_BY_ID_SUCCESS]: GET_USER_BY_ID_SUCCESS,
		[types.GET_USER_BY_ID_ERROR]: GET_USER_BY_ID_ERROR,

		[types.UPDATE_USER_REQUEST]: UPDATE_USER_REQUEST,
		[types.UPDATE_USER_SUCCESS]: UPDATE_USER_SUCCESS,
		[types.UPDATE_USER_ERROR]: UPDATE_USER_ERROR
	}

const initialState = {
	user: {}
};
export default createReducer( initialState, handlers );
