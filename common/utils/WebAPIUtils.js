import 'isomorphic-fetch';
import axios from 'axios';
import queryString from 'querystring';

export default class {

	static getLoggedUser(email){
		return axios({
			url: '/api/users/login',
			method: 'post',
			data: {email: email}
		}).then((res) => {
			return res.data
		})
	}

	static updateUser(userData){
		return axios({
			url: '/api/users/update',
			method: 'put',
			data: userData
		}).then((res) => {
			return res.data
		})
	}

	static getAllChangemakers() {
		return axios('/api/changemakers').then(res => {
			return res.data;
		});
	}

	static getChangemakerById(id) {
		return axios(`/api/changemakers/${id}`).then(res => {
			return res.data;
		});
	}

	static getAllUpdatesByUserId(id) {
		return axios('/api/changemakers/' + id + '/updates').then(res => {
			return res.data;
		});
	}

	static getFeaturedChangemakers(){
		return axios('/api/changemakers/featured').then(res => {
			return res.data;
		});
	}

	static getBackingsByChangemakerId(id) {
		return axios('/api/changemakers/' + id + '/backings').then(res => {
			return res.data;
		});
	}

	static saveChangemaker(data) {
		// TODO handle edit case
		return axios.post('/api/changemakers/', data).then(res => {
			return axios.get(res.headers.location);
		})
		.then(res => {
			return res.data;
		});
	}

	static search(term) {
		if (!term) {
			return Promise.resolve([]);
		}
    return axios(`/api/search?q=${term}`).then(res => {
			return res.data;
		});
	}

	static uploadVideo(file) {
		const fileData = new FormData();
		fileData.append('file', file, file.name);
		return axios.post('/api/media/', fileData, {
			params: {
				type: 'video'
			}
		}).then(res => {
			return res.data;
		});
	}

	static getUserById(userId, token){
		return axios({
			url: `/api/users/${userId}`,
			method: 'get',
			headers: {
				authorization: `Bearer ${token}`
			}
		}).then((res) => {
			return res.data;
		})
	}

	static updateUserProfile(userInformation, token){
		return axios({
			url: `/api/users/update/${userInformation.userId}`,
			method: 'put',
			data: userInformation,
			headers: {
				authorization: `Bearer ${token}`
			}
		}).then((res) => {
			return res.data;
		})
	}

	static oneTimeSupportForChangemaker(supportData, token){

		return axios({
			url: '/api/payment/mango/pay',
			method: 'post',
			data: supportData,
			headers: {
				authorization: `Bearer ${token}`
			}
		}).then((url) => {
			return url
		})
	}

	static createStatusUpdate(changemakerId, model) {

		return axios({
			url: `/api/changemakers/${changemakerId}/updates`,
			method: 'post',
			data: model
		});
	}

	static recurringSupportForChangemaker(supportData, token){
		return axios({
			url: '/api/payment/mango/recurring',
			method: 'post',
			data: supportData,
			headers: {
				authorization: `Bearer ${token}`
			}
		}).then((res) => {
			return res;
		})
	}

	static preRegisterCard(preTreatmentData, token){
		return axios({
			url: '/api/payment/mango/preRegisterCard',
			method: 'post',
			data: preTreatmentData,
			headers: {
				authorization: `Bearer, ${token}`
			}
		})
	}

	static registerCard(registrationData, url){
		return axios({
			url: url,
			method: 'post',
			data: queryString.stringify(registrationData),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}).then((res) => {
			let serverRegistrationData = {
				registrationData: res.data,
				registrationId: registrationData.Id
			}

			return axios({
				url: '/api/payment/mango/registerCard',
				data: serverRegistrationData,
				method: 'post'
			})
		})
	}

	static checkUserHasRegisteredCard(userId){
		return axios({
			url: '/api/users/checkCard',
			method: 'post',
			data: {userId: userId}
		})
	}

}
