export default class {

	constructor(dao) {
		this.dao = dao;
	}

	getCountries() {
		return this.dao.getCountries();
	}
}
