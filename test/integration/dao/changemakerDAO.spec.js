import { expect } from 'chai';

import changemakerDAO from '../../../server/data/changemakerDAO';
import DBTestUtil from './DBTestUtil';

describe('changemakerDAO', () => {

	const exampleChangemakerId = 1;

	before(() => {
		return DBTestUtil.refreshDB();
	});

	describe('.getChangemakerById', () => {

		it('should find and return an existing changemaker', () => {
			return changemakerDAO.getChangemakerById(1).then( changemaker => {
				expect(changemaker).to.have.property('id', 1);
			});
		});

		it('should return the specified result model', () => {

			return changemakerDAO.getChangemakerById(exampleChangemakerId).then(changemaker => {

				expect(changemaker).to.have.deep.property('user.firstName', 'Matthias');
				expect(changemaker).to.have.deep.property('user.lastName', 'Holzer');
				expect(changemaker).to.have.deep.property('user.avatarUrl', 'https://randomuser.me/api/portraits/med/men/42.jpg');
				expect(changemaker).to.have.property('videoUrl');
				expect(changemaker).to.have.property('approvalDate');
			});
		});

		it('should compute the last status update date', () => {
			return changemakerDAO.getChangemakerById(exampleChangemakerId).then(changemaker => {
				expect(changemaker).to.have.property('lastStatusUpdate');
			});
		});

		it('should compute the patron count', () => {
			return changemakerDAO.getChangemakerById(exampleChangemakerId).then(changemaker => {
				expect(changemaker).to.have.property('numberOfPatrons', 2);
			});
		});
	});

	describe('.getFeatured', () => {

		it('should return exactly 5 changemakers', () => {
			return changemakerDAO.getFeatured().then((changemakers) => {
        expect(changemakers).to.have.length(5);

				for (let i = 1; i < changemakers.length; i++) {
					expect(changemakers[i].id).not.to.equal(changemakers[i - 1].id);
				}
			});
		});

		it('should compute the last status update date', () => {
			return changemakerDAO.getFeatured().then(changemakers => {
				expect(changemakers[0]).to.have.deep.property('lastStatusUpdate');
			});
		});

		it('should compute the patron count', () => {
			return changemakerDAO.getFeatured().then(changemakers => {
				expect(changemakers[0]).to.have.property('numberOfPatrons', 18);
			});
		});

		it('should only return approved changemakers', () => {
			return changemakerDAO.getFeatured().then((changemakers) => {
        expect(changemakers[0]).to.have.property('approvalDate');
				expect(changemakers[1]).to.have.property('approvalDate');
				expect(changemakers[2]).to.have.property('approvalDate');
				expect(changemakers[3]).to.have.property('approvalDate');
				expect(changemakers[4]).to.have.property('approvalDate');
			});
		});

		it('should prefer changemakers with more recent updates', () => {
			return changemakerDAO.getFeatured().then((changemakers) => {
				let h1 = +new Date(changemakers[0].lastStatusUpdate);
				let l1 = +new Date(changemakers[1].lastStatusUpdate);
        expect(h1).to.be.at.least(l1);

				let h2 = +new Date(changemakers[1].lastStatusUpdate);
				let l2 = +new Date(changemakers[2].lastStatusUpdate);
        expect(h2).to.be.at.least(l2);

				let h3 = +new Date(changemakers[2].lastStatusUpdate);
				let l3 = +new Date(changemakers[3].lastStatusUpdate);
        expect(h3).to.be.at.least(l3);
			});
		});

		it('should compute the number of patrons', () => {
			return changemakerDAO.getFeatured().then((changemakers) => {
				let cm = changemakers[0];
        expect(cm.numberOfPatrons).to.equal(18);
			});
		});

	});

	describe('createChangemaker', () => {

		it('should create a changemaker', done => {
			const testData = {
				isApproved: false,
				mission: {
					text: 'Test mission'
				}
			};
			changemakerDAO.createChangemaker(testData).then( id => {
				return changemakerDAO.getChangemakerById(id);
			})
			.then( changemaker => {
				expect(changemaker).to.have.deep.property('mission.text', testData.mission.text);
				done();
			});
		});

	});

});
