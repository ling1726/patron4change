/* eslint no-console: 0 */
import chai from 'chai';
import axios from 'axios';
import config from 'config';
const { expect } = chai;

const port = config.get('port');
const url = `http://localhost:${port}/api/users`;

describe('/user', () => {

	describe('/login', () => {
		function req(email){
			return axios({
				url: `${url}/login`,
				method: 'post',
				data: {email: email}
			})
		}

		it('should return the user that is logged in', () => {
			return req('matthias.holzer@example.com')
				.then((res) => {
					expect(res.data.email).to.equal('matthias.holzer@example.com')
					expect(res.data.firstName).to.equal('Matthias')
					expect(res.data.lastName).to.equal('Holzer')
					expect(res.data.id).to.equal(1)
				});
		});

		it('should return the a new user that just registered', () => {
			return req('rebecca.keuler@example.com')
				.then((res) => {
					expect(res.data.email).to.equal('rebecca.keuler@example.com')
					expect(res.data.firstName).to.equal(null)
					expect(res.data.lastName).to.equal(null)
				});
		});

	});

	describe('/update', () => {
		function req(userInformation, userId){
			return axios({
				url: `${url}/update/${userId}`,
				method: 'put',
				data: {userInformation: userInformation}
			})
		}

		it('should return a user with updated information', () => {
			let userInformation = {
				id: 1,
				firstName: 'john',
				lastName: 'doe',
				countryOfResidence: 'united kingdom',
				nationality: 'sweden',
				birthday: 758926219000
			}

			return req(userInformation, userInformation.id).then((res) => {
				let user = res.data;
				expect(user.id).to.equal(1);
				expect(user.firstName).to.equal('john');
				expect(user.lastName).to.equal('doe');
				expect(user.countryOfResidence).to.equal('united kingdom');
				expect(user.nationality).to.equal('sweden');
				expect(new Date(user.birthday).getTime()).to.equal(758926219000)
			})

		})

		it('should throw error, incorrect date format', (done) => {
			let userInformation = {
				id: 1,
				firstName: 'john',
				lastName: 'doe',
				countryOfResidence: 'united kingdom',
				nationality: 'sweden',
				birthday: 'monday 25 2017'
			}

			req(userInformation, userInformation.id).then(() => {
				expect(1).to.equal(0) // supposed to fail
				done()
			}).catch(() => {
				done()
			})
		})
	})
});
