import models, { sequelize } from '../model';
import { extractProps } from '../utils/modelUtils';
import _ from 'lodash';

const CHANGEMAKER_LIMIT_LANDING_PAGE = 5;

function toUserModel(user = {}) {
	return Object.assign(user, {
		name: `${user.firstName} ${user.lastName}`
	});
}

function prepareDTO(rawCm) {
	if (!rawCm) {
		return null;
	}
	return Object.assign({}, rawCm, {
		user: toUserModel(extractProps(rawCm, 'user')),
		mission: extractProps(rawCm, 'mission'),
		numberOfPatrons: parseInt(rawCm.numberOfPatrons),
		lastStatusUpdate: rawCm.lastStatusUpdate
	});
}

const include = [
	{model: models.user, as: 'user'},
	{model: models.content, as: 'mission'},
	{model: models.statusUpdate, as: 'statusUpdates', attributes: []},
	{model: models.backing, as: 'backings', attributes: []}
];

const numberOfPatronsQ = [ sequelize.fn('COUNT', sequelize.col('*')), 'numberOfPatrons' ];

const attributes = {
	include: [
		[ sequelize.fn('MAX', sequelize.col('statusUpdates.createdAt')), 'lastStatusUpdate' ],
		numberOfPatronsQ
	]
};

const group = [
	['id'],
	[{model: models.user, as: 'user'}, 'id'],
	[{model: models.content, as: 'mission'}, 'id']
];

/**
* data access for changemakers
* queries related content of the user and flattens it into the result object
*/
export default class {

	static getAll() {
		return models.changemaker.findAll();
	}

	static getChangemakerById(id) {
		if ('number' !== typeof id) {
			throw new Error('changemaker id must be a number');
		}
		return models.changemaker.find({
			where: { id: id },
			include,
			attributes: {
				include: [numberOfPatronsQ]
			},
			group: group.concat([ [{model: models.statusUpdate, as: 'statusUpdates'}, 'createdAt'] ]),
			order: [
				[{model: models.statusUpdate, as: 'statusUpdates'}, 'createdAt', 'DESC']
			],
			raw: true
		}).then(prepareDTO);
	}

	static getFeatured() {

	 	return models.changemaker.findAll({
			include,
			attributes,
			group,
			order: [
				[ sequelize.fn('MAX', sequelize.fn('COALESCE', sequelize.col('statusUpdates.createdAt'), '-infinity')), 'DESC' ]
			],
			raw: true
		}).then(cms => {
			return _.take(cms, CHANGEMAKER_LIMIT_LANDING_PAGE).map(prepareDTO);
		});
	}

	static createChangemaker(data) {
		data.mission.id = Math.floor((Math.random() * 3000000) - 100);
		return models.changemaker.create(
			data,
			{
				include: [ models.changemaker.mission ]
			}
		).then( changemaker => {
			return changemaker.id;
		});
	}
}
