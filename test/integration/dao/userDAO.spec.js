const assert = require('chai').assert;
import userDAO from '../../../server/data/userDAO'
import chai from 'chai';
import DBTestUtil from './DBTestUtil'
const{expect} = chai;

describe('userDAO', () => {
	before( (done) => {
			DBTestUtil.refreshDB().then(() => {
				done()
			});
	})
	describe('get all users from the database', () =>{

		it('The number of returned users should equal to the number of test users', (done) =>{
			userDAO.getAllUsers().then(users => {
				assert.isArray(users);
				assert.equal(users.length, 11);
				done();
			})
			.catch((err) => {
				done(err);
			});
		});

		it('Each of the uses returned should be unique i.e. no duplicates', (done) => {
			userDAO.getAllUsers().then(users => {
					let userDictionary = {};
					assert.isArray(users);
					for(let i = 0; i < users.length; i ++){
							assert(!userDictionary.hasOwnProperty(users[i].id.toString()), 'There is a duplicated user !');
							userDictionary[users[i].id.toString()] = 1;
					}
					done();
			})
			.catch((err) => {
				done(err);
			});
		});
	});

	describe('update a user', () => {
		it('should update every field of a user', () => {
			let userInformation = {
				id: 1,
				firstName: 'john',
				lastName: 'doe',
				birthday: 758926219000,
				nationality: 'GB',
				countryOfResidence: 'GB'
			}

			return userDAO.updateUser(userInformation).then((res) => {
				expect(res.id).to.equal(1);
				expect(res.firstName).to.equal('john');
				expect(res.lastName).to.equal('doe');
				expect(res.nationality).to.equal('GB');
				expect(res.countryOfResidence).to.equal('GB');
				expect(new Date(res.birthday).getTime()).to.equal(758926219000)
			})
		})

		it('should return error because date format incorrect', (done) => {
			let userInformation = {
				id: 1,
				firstName: 'john',
				lastName: 'doe',
				fkCountryIdResidence: 'united kingdom',
				birthday: 'monday 25 2017'
			}

			userDAO.updateUser(userInformation).then(() => {
			}).catch(() => {
				done()
			})
		})
	})


});
