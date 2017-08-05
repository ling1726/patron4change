import types from '../constants/ActionTypes'
import WebAPIUtils from '../utils/WebAPIUtils'

export function getUpdates({ changemakerId }) {
	let promise = WebAPIUtils.getAllUpdatesByUserId(changemakerId);
	return {
		types: [
			types.GET_UPDATES_REQUEST,
			types.GET_UPDATES_SUCCESS,
			types.GET_UPDATES_ERROR
		],
		promise
	}
}

export function createStatusUpdate(changemakerId, model) {
	let promise = WebAPIUtils.createStatusUpdate(changemakerId, model);
	return {
		types: [
			types.CREATE_UPDATE_REQUEST,
			types.CREATE_UPDATE_SUCCESS,
			types.CREATE_UPDATE_ERROR
		],
		promise,
		model
	}
}
