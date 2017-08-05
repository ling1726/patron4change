const assert = require('chai').assert;
import chai from 'chai';
const{expect} = chai;
import periodicBackingDAO from '../../../server/data/periodicBackingDAO'
import DBTestUtil from './DBTestUtil'

describe('periodicBackingDAO', () => {
	before( (done) => {
			DBTestUtil.refreshDB().then(() => {
				done();
			});
	})


	describe('create a periodic backing for a changemaker', () => {

		it('should return a periodicBacking model on successful creation', (done) =>{
			periodicBackingDAO.createPeriodicBacking(1, 2, 1000, 1463496101).then((res) =>{
				expect(res.backing.amount).to.equal(1000);
				expect(res.backing.fkSenderId).to.equal(1);
				expect(res.backing.fkRecipientId).to.equal(2);
				expect(new Date(res.startDate).getTime()).to.equal(1463496101)
				done();
			}).catch((err) =>{
				done(err);
			})
		})

		it('userId = changemakerId, exception thrown', (done) =>{
			periodicBackingDAO.createPeriodicBacking(1, 1,1000, 1463496101).then(() => {
				assert.isOk(false, 'no exception was thrown for wrong input');
				done();
			}).catch((err) => {
				expect(err.message).to.equal('a changemaker cannot back himself!');
				done();
			})
		})

		it('user does not exist, exception thrown', (done) =>{
			periodicBackingDAO.createPeriodicBacking(9999, 1,1000, 1463496101).then(() => {
				assert.isOk(false, 'no exception was thrown for wrong input');
				done();
			}).catch((err) => {
				expect(err.message).to.equal('user 9999 does not exist');
				done();
			})
		})

		it('changemaker does not exist, exception thrown', (done) =>{
			periodicBackingDAO.createPeriodicBacking(1, 9999, 1000, 1463496101).then(() => {
				assert.isOk(false, 'no exception was thrown for wrong input');
				done();
			}).catch((err) => {
				expect(err.message).to.equal('changemaker 9999 does not exist');
				done();
			})
		})

		it('amount is not a number, exception thrown', (done) =>{
			periodicBackingDAO.createPeriodicBacking(1, 2, 'asbd', 1463496101).then(() => {
				assert.isOk(false, 'no exception was thrown for wrong input');
				done();
			}).catch((err) => {
				expect(err.message).to.equal('not a valid amount');
				done();
			})
		})

		it('timestamp not valid, exception thrown', (done) =>{
			periodicBackingDAO.createPeriodicBacking(1, 2, 1000, '17/04/1994').then(() => {
				assert.isOk(false, 'no exception was thrown for wrong input');
				done();
			}).catch((err) => {
				expect(err.message).to.equal('not a valid timestamp, UNIX timestamp only please');
				done();
			})
		})

	})

	describe('retrieve all unpaid periodic backings', () => {
		it('should retrieve all unpaid periodic backings this month', () => {
			return periodicBackingDAO.getAllUnpaidPeriodicBackings().then((res) => {
				expect(res.length).to.equal(3);
				expect(res[0].fkBackingId).to.equal(8);
				expect(res[1].fkBackingId).to.equal(9);
				expect(res[2].fkBackingId).to.equal(11);
			})
		}).timeout(10000)
	})

});
