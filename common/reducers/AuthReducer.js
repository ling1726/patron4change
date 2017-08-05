import types from '../constants/ActionTypes'
import createReducer  from '../utils/createReducer'

// The auth reducer. The starting state sets authentication
// based on a token being in local storage. In a real app,
// we would also want a util to check if the token is expired.

function LOGIN_SUCCESS(state, action){
	return {
		...state,
		isAuthenticated: true,
		profile: action.profile,
		loggedUserId: action.userId,
		incorrectData: action.incorrectData
	}

}

function LOGIN_ERROR(state){

	return {
		...state,
		isAuthenticated: false,
		profile: null,
		loggedUserId: null
	}

}

function LOGOUT_SUCCESS(state){
	return {
		...state,
		isAuthenticated: false,
		profile: null,
		loggedUserId: null
	}
}

const handlers = {
	[types.LOGIN_SUCCESS]: LOGIN_SUCCESS,
	[types.LOGIN_ERROR]: LOGIN_ERROR,
	[types.LOGOUT_SUCCESS]: LOGOUT_SUCCESS

}

let initialLoginState = {
	isAuthenticated: false,
	profile: null,
	loggedUserId:null
}

export default createReducer(initialLoginState, handlers)

