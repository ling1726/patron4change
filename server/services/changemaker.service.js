export default class {

	constructor(dao, backingDAO, statusDAO) {
		this.dao = dao;
		this.backingDAO = backingDAO;
		this.statusDAO = statusDAO;
	}

	getAllChangemakers() {
		return this.dao.getAll();
	}

	getChangemakerById(id) {
		let changemaker = this.dao.getChangemakerById(id);
		changemaker.statusUpdates = this.statusDAO.getUpdatesByChangemakerId(id);
		return changemaker;
	}

	getUpdates(id) {
		return this.statusDAO.getUpdatesByChangemakerId(id);
	}

	getChangemakerByUsername(username) {
		return this.dao.getByUsername(username);
	}

	getFeaturedChangemakers() {
		return this.dao.getFeatured();
	}

	getBackingsByChangemakerId(id) {
		return this.backingDAO.getByChangemakerId(id);
	}

	createChangemaker(changemaker) {
		changemaker.isApproved = false;
		return this.dao.createChangemaker(changemaker);
	}

	createUpdate(id, update) {
		return this.statusDAO.create(id, update);
	}
}
