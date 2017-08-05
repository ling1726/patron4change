import mango from './payments/mango'

export default class {

	constructor(dao) {
		this.dao = dao;
		this.mango = new mango()
	}

	checkUserData(user){
		if(!user.firstName){
			return false;
		}
		if(!user.lastName){
			return false;
		}
		if(!user.birthday){
			return false;
		}
		if(!user.nationality){
			return false;
		}
		if(!user.countryOfResidence){
			return false;
		}

		return true;
	}

	getAllUsers() {
		return this.dao.getAllUsers();
	}

	getUserByUsername(username) {
		return this.dao.getUserByUsername(username);
	}

	getUserForId(id) {
		return this.dao.getUserForId(id);
	}

	loginUser(email){
		return this.dao.getUserForEmail(email).then((user) => {
			if(null === user){
				return this.dao.createUser(email)
			}else{
				return Promise.resolve(user)
			}
		}).then((user) => {
			let myUser = {
				id: user.id,
				firstName: user.firstName,
				lastName: user.lastName,
				birthday: user.birthday,
				email: user.email,
				nationality: user.nationality,
				countryOfResidence: user.countryOfResidence
			}
			if(!this.checkUserData(myUser)){
				myUser.incorrectData = true;
			}
			return myUser;
		})
	}

	updateUser(userData) {
		userData.PersonType = 'NATURAL';
		userData.userId = userData.id;
		return this.mango.registerUser(userData).catch((err) => {
			if('this user already has an accountId' !== err.message){
				throw new Error('error creating mango account for user')
			}
		}).then((res) => {
			return this.dao.updateUser(userData)
		}).then((user) => {
			let myUser = {
				id: user.id,
				firstName: user.firstName,
				lastName: user.lastName,
				birthday: user.birthday,
				email: user.email,
				nationality: user.nationality,
				countryOfResidence: user.countryOfResidence
			}
			if(!this.checkUserData(myUser)){
				myUser.incorrectData = true;
			}
			return myUser;
		})
	}

	checkUserHasRegisteredCard(userData){
		return this.dao.checkUserHasRegisteredCard(userData.userId)
	}

}
