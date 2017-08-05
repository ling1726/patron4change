import types from '../constants/ActionTypes'
import WebAPIUtils from '../utils/WebAPIUtils'

export function getUserById(email) {
	return {
		types: [
			types.GET_USER_BY_ID_REQUEST,
			types.GET_USER_BY_ID_SUCCESS,
			types.GET_USER_BY_ID_ERROR
		],
		email,
		promise: WebAPIUtils.getLoggedUser(email)
	};
}

export function updateUser(userData){
	return {
		types:[
			types.UPDATE_USER_REQUEST,
			types.UPDATE_USER_SUCCESS,
			types.UPDATE_USER_ERROR
		],
		promise: WebAPIUtils.updateUser(userData)
	}
}
