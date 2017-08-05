
export default class {

	constructor(dao) {
		this.dao = dao;
	}

	getAllPatrons() {
		return this.dao.getAllPatrons();
	}
}
