const assert = require('chai').assert;
import axios from 'axios'
const http = require('request-promise');
import DBTestUtil from '../../../integration/dao/DBTestUtil'
const urlbase = 'http://localhost:3000/api/payment'
import chai from 'chai';
const{expect} = chai;

describe('/payment', () => {
	before( () => {
		return DBTestUtil.refreshDB();
	})

	describe('/mango/register', () => {
		it('API call to register user should correctly return a mango naturalUserId',(done) => {
				let options = {
					method: 'POST',
					uri: urlbase + '/mango/register',
					body:{
						firstName: 'Tom',
						lastName: 'Walker',
						birthday: 1320969600,
						nationality: 'GB',
						countryOfResidence: 'GB',
						email: 'tom@mail.test.com',
						PersonType: 'NATURAL',
						userId: 1
					},
					json:true
				};
				http(options).then((res) => {
					assert.isNotNaN(res, 'a numeric Id is returned')
					done();
				})
				.catch((err) => {
					done(err);
				})
		}).timeout(10000);

		it('this API call to register user has missing first name field, should receive error', (done) => {
				let options = {
					method: 'POST',
					uri: urlbase + '/mango/register',
					body:{
						firstName: 'Tom',
						lastName: 'Walker',
						birthday: 1320969600,
						nationality: 'GB',
						countryOfResidence: 'GB',
						email: 'tom@mail.test.com',
						PersonType: 'NATURAL'
					},
					json:true
				};
				http(options).then(() => {
					assert.isOk(false, 'the request should not have succeeded');
					done();
				})
				.catch((err) => {
					assert(400 === err.statusCode, 'the error has status code 400');
					done();
				})
		}).timeout(10000);

	})

	describe('/mango/pay', () => {
			it('this API call to make a card payment should return the actual payment url',(done) => {
			let body = {
				patronId: 1,
				changemakerId: 2,
				amount: 1000,
				accountId: 18559606
        };

			let options = {
					method: 'POST',
					uri: urlbase + '/mango/pay',
					body:body,
					json:true
				};

			http(options).then((res) => {
					assert(res.startsWith('https'), 'should return redirect URL to payment interface');
					done();
				})
				.catch((err) => {
					done(err);
				})
		}).timeout(10000);

		it('this API call to make a card payment has faulty params, should get error',(done) => {
			let body = {
				changemakerId: 2,
				amount: 1000,
				accountId: '18559606'
        };

			let options = {
					method: 'POST',
					uri: urlbase + '/mango/pay',
					body:body,
					json:true
				};

			http(options).then(() => {
					assert.isOK(false, 'the request should not have succeeded');
					done();
				})
				.catch(() => {
					done();
				})
		}).timeout(10000);
	})

	describe('/mango/preregisterCard', () => {
		it('should return the preregistration data', () => {
			let formData = {
				userId: 2
			}
			return axios({
				url: `${urlbase}/mango/preregisterCard`,
				method: 'post',
				data: formData
			}).then((res) => {
				expect(res.data.Id).to.exist;
				expect(res.data.AccessKey).to.exist;
				expect(res.data.PreregistrationData).to.exist;
				expect(res.data.CardRegistrationURL).to.exist;
			})
		}).timeout(10000)
	})

	describe('/mango/recurring', () => {
		it('should return an instance of peridic backing', () => {
			let today = new Date().getTime();
			let formData = {
				patronId: 9,
				changemakerId: 8,
				amount: 100,
				startDate: today
			}
			return axios({
				url: `${urlbase}/mango/recurring`,
				method: 'post',
				data: formData
			}).then((res) => {
				expect(new Date(res.data.startDate).getTime()).to.equal(today);
				expect(res.data.fkBackingId).to.exist;
			})
		})
	})
})
