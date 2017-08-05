/* eslint no-console: 0 */
import chai from 'chai';
import axios from 'axios';
import config from 'config';
const { expect } = chai;

const port = config.get('port');
const baseUrl = `http://localhost:${port}`;
const url = `${baseUrl}/api/changemakers`;

function msg(err) {
	if (err.Error) {
		return err.Error;
	}
	if (err.response) {
		return err.response.statusText || 'Unknown Error';
	}
	return 'Unknown Error';
}

describe('/changemakers', () => {

	describe('/1', () => {

		const idUrl = url + `/${1}`;

		function req() {
			return axios.get(idUrl)
				.catch((err) => {
					console.log('test failure caught:', msg(err));
					expect.fail();
				});
		}

		it('should return the specified result model', () => {
			return req()
				.then((res) => {
					const changemaker = res.data;
					expect(changemaker).to.have.deep.property('user.firstName', 'Matthias');
					expect(changemaker).to.have.deep.property('user.lastName', 'Holzer');
					expect(changemaker).to.have.deep.property('user.firstName', 'Matthias');
					expect(changemaker).to.have.deep.property('mission.id');
					expect(changemaker).to.have.deep.property('mission.text');
				});
		});

		it('should not return infrastructure-relevant fields', () => {
			return req()
				.then((res) => {
					const changemaker = res.data;
					expect(changemaker).not.to.have.deep.property('fkUserId');
					expect(changemaker).not.to.have.deep.property('fkContentId');
					expect(changemaker).not.to.have.deep.property('user.pwhash');
					expect(changemaker).not.to.have.deep.property('user.emailIsConfirmed');
					expect(changemaker).not.to.have.deep.property('user.isBlocked');
					expect(changemaker).not.to.have.deep.property('isApproved');
				});
		});

	});

	describe('/', () => {

		it('should create a changemaker which is not approved', () => {
			return axios.post(url, {
				mission: {
					text: 'foo'
				}
			}).then(res => {
				return axios.get(baseUrl + res.headers.location);
			}).then(res => {
				expect(res.data).to.have.deep.property('isApproved', false);
			});
		})

	})

	describe('/featured', () => {

		const featuredUrl = url + '/featured';

		function req() {
			return axios.get(featuredUrl)
				.catch((err) => {
					console.log('test failure caught:', msg(err));
					expect.fail();
				});
		}

		it('should return at least 5 featured changemakers', () => {
			return req()
				.then((res) => {
					const results = res.data;
					expect(results).to.have.length.of.at.least(5);
				});
		});

		it('should return the specified result model', () => {
			return req()
				.then((res) => {
					const results = res.data;
					let changemaker = results[0];
					expect(changemaker).to.have.deep.property('user.firstName', 'Klara');
					expect(changemaker).to.have.deep.property('user.lastName', 'goldfaden');
				});
		});

	});

	describe('/1/backings', () => {

		const apiUrl = url + '/1/backings';

		function req() {
			return axios.get(apiUrl)
				.catch((err) => {
					console.log('test failure caught:', msg(err));
					expect.fail();
				});
		}

		it('should return the backings for a changemaker', () => {
			return req()
				.then(res => {
					const results = res.data;
					expect(results).to.have.length.of.at.least(1);
				});
		});

		it('should fail if using non-numeric id', done => {
			axios.get(url + '/asdasd/backings')
				.then(() => {
					expect.fail('should fail with 400');
					done();
				})
				.catch(err => {
					expect(err.response.status).to.equal(400);
					done();
				});
		});

	});

});
