import models from '../model/index';

function prepareDTO(rawCm) {
	return {
		id: rawCm.id,
		title: rawCm.title,
		text: rawCm['content.text'],
		createdAt: rawCm.createdAt
	};
}

export default class {

	static getUpdatesByChangemakerId(fkChangemakerId) {
		return models.statusUpdate.findAll({
			where: { fkChangemakerId },
			include: [{model: models.content, as: 'content'}],
			order: [['createdAt', 'DESC']],
			raw: true
		}).then(updates => updates.map(prepareDTO));
	}

	static create(fkChangemakerId, model) {
		return models.statusUpdate.create({
			createdAt: new Date(),
			title: model.title,
			fkChangemakerId,
			content: { text: model.text, id: Math.floor((Math.random() * 3000000) - 100) }
		}, {
			include: [{
		    association: models.statusUpdate.content
		  }]
		}).then( update => {
			return update.id;
		});
	}

}
