import { expect } from 'chai';

import dao from '../../../server/data/statusUpdateDAO';
import DBTestUtil from './DBTestUtil';

describe('statusUpdateDAO', () => {

	const cmId = 1;

	before(() => {
		return DBTestUtil.refreshDB();
	});

	describe('.getUpdatesByChangemakerId', () => {

		it('should find status updates for a changemaker', () => {
			return dao.getUpdatesByChangemakerId(cmId).then( updates => {
				expect(updates).to.have.length.above(0);
			});
		});

  });
});
