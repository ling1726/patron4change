/* eslint no-console: 0 */
// no-console: until silly-logger is applied

import models from '../../../server/model/index';
import { testInsert } from './testInsert';
import config from 'config';

export default class {

	static refreshDB() {
		const logging = config.get('dblog') ? console.log : false;
		return models.sequelize.sync({
			force: true,
			logging
		}).then(() => testInsert(models, logging));
	}
}
