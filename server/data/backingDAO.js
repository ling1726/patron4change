import models from '../model/index';
import { extractProps } from '../utils/modelUtils';

function toUserModel(user = {}) {
	return Object.assign(user, {
		name: `${user.firstName} ${user.lastName}`
	});
}

function toBackingDTO(rawBacking) {
	return Object.assign({}, {
		id: rawBacking.id,
		amount: rawBacking.amount,
		createdAt: rawBacking.createdAt,
		type: 'recurring'
	}, {
		supporter: toUserModel(extractProps(rawBacking, 'user'))
	})
}

export default class{

	static getByChangemakerId(changemakerId) {

		return models.backing.findAll({
			where: { fkRecipientId: changemakerId },
			include: [
				{model: models.user, as: 'user'}
			],
			order: [
				['createdAt', 'DESC']
			],
			raw: true
		}).then(backings => {
			return backings.map(toBackingDTO);
		});
	}
}
