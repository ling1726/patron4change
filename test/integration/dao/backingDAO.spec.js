import backingDAO from '../../../server/data/backingDAO';
import DBTestUtil from './DBTestUtil';
import { expect } from 'chai';

describe('backingDAO', () => {

	before(() => {
		return DBTestUtil.refreshDB();
	});

	describe('.getByChangemakerId', () => {

		const twoSupporterId = 1;
		const oneSupporterId = 4;

		it('should return all backings for a changemaker', () => {
			return backingDAO.getByChangemakerId(twoSupporterId).then(backings => {
				expect(backings).to.have.length(2);
			});
		});

		it('should return more recent backings first', () => {
			return backingDAO.getByChangemakerId(twoSupporterId).then(backings => {
				expect(+backings[0].createdAt).to.be.above(+backings[1].createdAt);
			});
		});

		it('should return the correct backing model', () => {
			return backingDAO.getByChangemakerId(oneSupporterId).then(backings => {
				let b1 = backings[0];
				expect(b1).to.have.deep.property('supporter.firstName', 'Maria');
				expect(b1).to.have.deep.property('supporter.lastName', 'Molner');
				expect(b1).to.have.deep.property('supporter.name', 'Maria Molner');
				expect(b1.createdAt).to.be.an.instanceof(Date);
				expect(+b1.createdAt).to.equal(1458651480000);
				expect(b1).to.have.property('amount', 1250);
				expect(b1).to.have.property('type', 'recurring');
			});
		});
	});

});
