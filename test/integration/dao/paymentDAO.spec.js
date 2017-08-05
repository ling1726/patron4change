const assert = require('chai').assert;
import chai from 'chai';
const{expect} = chai;
import paymentDAO from '../../../server/data/paymentDAO'
import DBTestUtil from './DBTestUtil'

describe('paymentDAO', () => {
	before(() => {
		return DBTestUtil.refreshDB();
	})
	describe('register a changemaker to a payment provider', () =>{

		it('should return a paymentServiceData model upon successful creation', (done) =>{
			paymentDAO.registerChangemakerToProvider(1,1,'1').then((res) => {
				assert(1 === res.fkUserId,
						`changemakerId is supposed to be 1, but it is actually: ${res.fkUserId}`);
				assert( 1 === res.fkPaymentProviderId,
						`paymentProviderId is supposed to be 1, but it is actually, ${res.fkPaymentProviderId}`);
				assert( '1' ===  res.accountId,
						`accountId is supposed to be 1, but it is actually ${res.accountId}`);
				done();
			})
			.catch((err) => {
				done(err);
			})
		});

		it('changemakerId that doesn\'t exist, should throw error', (done) => {
			paymentDAO.registerChangemakerToProvider(9999, 9999, '2').then(() => {
					assert.isOk(false, 'no exception was thrown for wrong input')
					done();
			}).catch((err) => {
				assert('changemaker 9999 does not exist' === err.message);
				done();
			})
		});

		it('paymentProviderId doesn\'t exist, should throw error', (done) => {
			paymentDAO.registerChangemakerToProvider(1, 9999, '2').then(()=>{

				assert.isOk(false,'no exception was thrown for wrong input')
				done();
			}).catch((err) => {
				assert('provider 9999 does not exist' === err.message)
				done();
			})
		});

		it('should return a singleBacking model on successful creation', () => {
			return paymentDAO.createSingleBacking(1, 2, 'abc', 1000, 'adoring y', 1463496101).then((res) => {

				assert(1000 === res.backing.amount, 'the backing amount does not match the input');
				assert(1000 === res.backing.payments[0].amount, 'the payment amount does not match input');
				// assert(res.backing.payments[0].transactionDate === 1463496101, 'the payment date does not match input');
				assert('abc' === res.backing.payments[0].transactionId, 'the payment transactionId does not match input');
			});
		});
	});

	describe('get a changemaker payment provider account', () => {

		it('return the account Id from previous test case, where it was created', () =>{
			return paymentDAO.getAccountIdForUser(1, 1).then((res) => {
				assert('1' === res, 'accountId is incorrect expected value is 1, actual value is:' + res);
 			});
		});

		it('userId = changemakerId, exception thrown', (done) =>{
			paymentDAO.createSingleBacking(1, 1, 'abc', 1000, 'adoring y', 1463496101).then(() => {
				expect.fail('no exception was thrown for wrong input');
				done();
			}).catch(() => {
				done();
			});
		});

		it('querying an changemaker payment provider account which does not exist', () => {
			return paymentDAO.getAccountIdForUser(1, 9999).then((res) => {
				expect(res).to.be.falsy;
			});
		})

		it('user does not exist, exception thrown', (done) =>{
			paymentDAO.createSingleBacking(9999, 1, 'abc', 1000, 'adoring y', 1463496101).then(() => {
				expect.fail('no exception was thrown for wrong input');
				done();
			}).catch(() => {
				done();
			});
		});
	});

	describe('add a card registration to a payment account', () => {

		it('add card registration data', () => {
			return paymentDAO.setCardRegistrationForAccount('1', 1, 'abcd123')
				.then((res) => {
					expect(res).to.be.true;
				});
		})

		it('account does not exist - throw error', (done) => {
			paymentDAO.setCardRegistrationForAccount('dsff', 1,'abcd123')
			.then(() => {
					assert.isOk(false, 'An error should be thrown');
					done();
			}).catch((err) => {
					expect(err.message).to.equal('no account has been found for dsff');
					done()
			})
		})

		it('changemaker does not exist, exception thrown', (done) =>{
			paymentDAO.createSingleBacking(1, 9999, 'abc', 1000, 'adoring y', 1463496101).then(() => {
				expect.fail('no exception was thrown for wrong input');
				done();
			}).catch((err) => {
				try {
					assert('user 9999 does not exist' === err.message);
				} finally {
					done();
				}
			});
		});
	});

	describe('get card registration data', () => {

		it('get previous card registration data', () => {
			return paymentDAO.getCardRegistrationForAccount('1',1).then((res) => {
				expect(res).to.equal('abcd123');
			})
		})

		it('amount is not a number, exception thrown', (done) => {
			paymentDAO.createSingleBacking(1, 2, 'abc', 'asbd', 'adoring y', 1463496101).then(() => {
				expect.fail('no exception was thrown for wrong input');
				done();
			}).catch(() => {
				done();
			});
		});
	});

	describe('create a payment', () => {
		it('create a new payment from an existing backing', () => {
			return paymentDAO.createPayment(1000, 1483903845, 'abc', 1).then((res) => {
				expect(res.amount).to.equal(1000);
				expect(new Date(res.transactionDate).getTime()).to.equal(1483903845);
				expect(res.transactionId).to.equal('abc');
				expect(res.fkBackingId).to.equal(1);
			});
		});

		it('timestamp not valid, exception thrown', (done) => {
			paymentDAO.createSingleBacking(1, 2, 'abc', 1000, 'adoring y', '17/04/1994').then(() => {
				expect.fail('no exception was thrown for wrong input');
				done();
			}).catch(() => {
				done();
			});
		});
	});

	describe('get card registration for a user', () => {
		it('get a card registration for a user previously set', () => {
			return paymentDAO.getCardRegistrationForUser('1', 1).then((res) => {
				expect(res).to.equal('abcd123');
			});
		})
	})
});
