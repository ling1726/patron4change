import chai from 'chai';
import axios from 'axios';
import config from 'config';
const { expect } = chai;

const port = config.get('port');
const url = `http://localhost:${port}/api/search`;

describe('/search', () => {

	it('should return at least one match for a name search', () => {
		return axios.get(url + '?q=Matthias%20Holzer')
			.then((res) => {
				const results = res.data;
				expect(results).to.have.length(1);
			})
			.catch((err) => {
				expect.fail(err.response ? err.response.statusText || 'Unknown error' : 'Unknown error');
			});
	});

	it('should determine an above-5% relevance for exact name match', () => {
		return axios.get(url + '?q=Matthias%20Holzer')
			.then((res) => {
				const results = res.data;
				const result = results[0];
				expect(result.match.relevance).to.be.above(0.05);
			})
			.catch((err) => {
				expect.fail(err.response ? err.response.statusText || 'Unknown error' : 'Unknown error');
			});
	});

	it('should annotate the result data with the name of the searched changemaker', () => {
		return axios.get(url + '?q=Matthias%20Holzer')
			.then((res) => {
				const results = res.data;
				const result = results[0];
				expect(result.changemaker.firstName).to.equal('Matthias');
				expect(result.changemaker.lastName).to.equal('Holzer');
			})
			.catch((err) => {
				expect.fail(err.response ? err.response.statusText || 'Unknown error' : 'Unknown error');
			});
	});

	// TODO test for multi-match sorting by relevance
});
