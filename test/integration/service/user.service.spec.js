import userService from '../../../server/services/users.service'
import DBTestUtil from '../dao/DBTestUtil'
import { expect } from 'chai';
import userDAO from '../../../server/data/userDAO'

describe('user service', () => {
	before( (done) => {
		DBTestUtil.refreshDB().then(() => {
			done();
		});
	})
	describe('loginUser', () =>{

		it('should return an existing user in the database with all user data', () =>{
			let service = new userService(userDAO);
			return service.loginUser('matthias.holzer@example.com').then((user) => {
				expect(user.email).to.equal('matthias.holzer@example.com')
				expect(user.firstName).to.equal('Matthias')
				expect(user.lastName).to.equal('Holzer')
				expect(user.id).to.equal(1)
			})
		});

		it('should return a newly created user with only email info', () => {
			let service = new userService(userDAO);
			return service.loginUser('rebecca.keuler@example.com').then((user) => {
				expect(user.email).to.equal('rebecca.keuler@example.com')
				expect(user.firstName).to.equal(null)
				expect(user.lastName).to.equal(null)
			})
		});
	});

	describe('updateUser', () =>{

		it.only('should update user info, create account if not already existing', () =>{
			let service = new userService(userDAO);
			let userData = {
				id: 1,
				firstName: 'john',
				lastName: 'doe',
				birthday: 1320969600,
				email: 'matthias.holzer@example.com',
				nationality: 'GB',
				countryOfResidence: 'GB'
			}
			return service.updateUser(userData).then((user) => {
				expect(user.email).to.equal('matthias.holzer@example.com')
				expect(user.firstName).to.equal('john')
				expect(user.lastName).to.equal('doe')
				expect(user.id).to.equal(1)
			})
		});
	});
});
