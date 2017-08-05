const assert = require('chai').assert;
import mangoUtils from '../../../../server/services/payments/mangoUtils'
import DBTestUtil from '../../../integration/dao/DBTestUtil'
import chai from 'chai';
const{expect} = chai;
const mango = new mangoUtils();

describe('mangopay API specific logic', () => {
	before( (done) => {
		DBTestUtil.refreshDB().then(() => {
			done();
		});
	});

	describe('createNaturalUser', () => {
		it.only('should return a mango user Id',(done) => {
			let userObject = {
				firstName: 'Tom',
				lastName: 'Walker',
				birthday: 1320969600,
				nationality: 'GB',
				countryOfResidence: 'GB',
				email: 'tom@mail.test.com',
				PersonType: 'NATURAL'
			};

			mango.createNaturalUser(userObject, 1).then((res) => {
				expect(res).to.exist;
			done();
			}).
			catch((err) => {
				done(err);
			})
		}).timeout(10000);

		it.only('should throw and exception because user already has an account',(done) => {
			let userObject = {
				firstName: 'Tom',
				lastName: 'Walker',
				birthday: 1320969600,
				nationality: 'GB',
				countryOfResidence: 'GB',
				email: 'tom@mail.test.com',
				PersonType: 'NATURAL'
			};

			mango.createNaturalUser(userObject, 1).then(() => {
				assert.isOk(false, 'this will fail');
				done();
			}).
			catch((err) => {
				expect(err.message).to.equal('this user already has an accountId')
				done();
			})
		}).timeout(10000);

	});

	describe('createWallet', () => {
		it.only('should create a wallet and return its Id', (done) =>{
			mango.createWallet('18559606', 1).then((res) => {
				expect(res).to.exist;
				done();
			}).catch((err) => {
				done(err);
			})
		}).timeout(10000);
	})

	describe('getUserWallet', () => {
		it.only('should retrieve the walletId of a user given the user Id', (done) => {
			mango.getUserWallet(9).then((res) => {
				assert(res, 'the returned value was not valid');
				done()
			}).catch((err) => {
				done(err);
			})
		}).timeout(10000);
	})

	describe('createCardPayment', () => {
		it.only('should create a backing and payment for a changemaker ' +
			'using mangopay, a redirect url should be given', (done) => {
			let paymentData = {
				changemakerAccountId: '18559606',
				patronAccountId: '19783813',
				amount: 1000,
				patronId: 8,
				changemakerId: 9
			}
			mango.createCardPayment(paymentData).then((res) => {
				assert(res.startsWith('https://'),
					'the returned value was not a valid address');
				done();
			}).catch((err) => {
				done(err);
			})
		}).timeout(10000)
	})

	describe('getPreCardRegistrationData', () => {
		it('should call shoud get card pre registration data from mangopay API server for a specific user', (done) => {
			mango.preRegisterCard(2).then((res) => {
				expect(res.Id).to.exist;
				expect(res.PreregistrationData).to.exist;
				expect(res.AccessKey).to.exist;
				expect(res.CardRegistrationURL).to.exist;
				done();
			}).catch((err) => {
				done(err)
			})

		}).timeout(10000)
	});

	describe('entire card registration process with mangopay', () => {
		it('should complete the card registration service for a test card provided by mangoPay', () => {
			return mango.preRegisterCard(2).then((preRegistrationData) => {
				let registrationData = mango.sendTestCardData(preRegistrationData)
				return registrationData
			}).then((registrationData) => {
				return mango.registerCard(registrationData.data, registrationData.registrationId)
			}).then((cardId) => {
				expect(cardId).to.exist;
			})
		}).timeout(10000)
	});

	describe('make a single unique payment with a registered card', () => {
		it('should create the payment and create the transaction ID and date', () => {
			return mango.makePayment('19783237', '19765947', '19783207', 100).then((res) => {
				expect(res.transactionId).to.exist;
				expect(res.transactionDate).to.exist;
			})
		}).timeout(10000)
	});

	describe('Request cardId from mango', () => {
		it('should return a cardId from mangopay', () => {
			return mango.getCardId('19807396').then((res) => {
				expect(res).to.equal('19807397');
			})
		}).timeout(10000);

		it('should throw an exception because no such card exists', (done) => {
			mango.getCardId('12345').then(() => {
				assert(false, 'this call should not be successful')
			}).catch(() => {
				done();
			})
		})
	});

	describe('make a montly payment between patron and changemaker',() => {
		it('should successfully create the monthly payment', () => {
			return mango.makeMonthlyPayment(8, 9, 100, 8).then((res) =>{
				expect(res).to.equal(true);
			})
		}).timeout(10000);

		it('should throw an exception, both users do not have payment accounts', (done) => {
			mango.makeMonthlyPayment(5, 6, 100, 7).then(() => {
				assert(false, 'this call should not be successful');
			}).catch(() => {
				done();
			})
		}).timeout(10000)
	})

});
