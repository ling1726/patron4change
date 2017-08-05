const assert = require('chai').assert;
import singleBackingDAO from '../../../server/data/singleBackingDAO'
import DBTestUtil from './DBTestUtil'
import chai from 'chai';
const{expect} = chai;

describe('singleBackingDAO', () => {
	before( (done) => {
	DBTestUtil.refreshDB().then(() => {
		done();
});
})

describe('create a single backing for a changemaker', () => {

	it('should return a singleBacking model on successful creation', () =>{
		let backingData= {
			userId: 1,
			changemakerId: 2,
			amount: 1000,
			transactionDate: 1463496101,
			transactionId: 'abc'
		}
	return singleBackingDAO.createSingleBacking(backingData).then((res) =>{
		expect(res.backing.amount).to.equal(1000);
		expect(res.backing.payments[0].amount).to.equal(1000);
		expect(new Date(res.backing.payments[0].transactionDate).getTime()).to.equal(1463496101);
		expect(res.backing.payments[0].transactionId).to.equal('abc');
})
})

it('userId = changemakerId, exception thrown', (done) =>{
	let backingData= {
		userId: 1,
		changemakerId: 1,
		amount: 1000,
		transactionDate: 1463496101,
		transactionId: 'abc'
	}
	singleBackingDAO.createSingleBacking(backingData).then(() => {
	assert.isOk(false, 'no exception was thrown for wrong input');
done();
}).catch((err) => {
	assert('a changemaker cannot back himself!' === err.message);
done();
})
})

it('user does not exist, exception thrown', (done) =>{
	let backingData= {
		userId: 9999,
		changemakerId: 1,
		amount: 1000,
		transactionDate: 1463496101,
		transactionId: 'abc'
	}
	singleBackingDAO.createSingleBacking(backingData).then(() => {
	assert.isOk(false, 'no exception was thrown for wrong input');
done();
}).catch((err) => {
	assert('user 9999 does not exist' === err.message);
done();
})
})

it('changemaker does not exist, exception thrown', (done) =>{
	let backingData= {
		userId: 1,
		changemakerId: 9999,
		amount: 1000,
		transactionDate: 1463496101,
		transactionId: 'abc'
	}
	singleBackingDAO.createSingleBacking(backingData).then(() => {
	assert.isOk(false, 'no exception was thrown for wrong input');
done();
}).catch((err) => {
	assert('changemaker 9999 does not exist' === err.message);
done();
})
})

it('amount is not a number, exception thrown', (done) =>{
	let backingData= {
		userId: 1,
		changemakerId: 2,
		amount: 'asbd',
		transactionDate: 1463496101,
		transactionId: 'abc'
	}
	singleBackingDAO.createSingleBacking(backingData).then(() => {
	assert.isOk(false, 'no exception was thrown for wrong input');
done();
}).catch((err) => {
	assert('not a valid amount' === err.message);
done();
})
})

it('timestamp not valid, exception thrown', (done) =>{
	let backingData= {
		userId: 1,
		changemakerId: 2,
		amount: 1000,
		transactionDate: '17/04/1994',
		transactionId: 'abc'
	}
	singleBackingDAO.createSingleBacking(backingData).then(() => {
	assert.isOk(false, 'no exception was thrown for wrong input');
done();
}).catch((err) => {
	assert('not a valid timestamp, UNIX timestamp only please' === err.message);
done();
})
})

})


});
