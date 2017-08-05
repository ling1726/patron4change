import chai from 'chai';
import axios from 'axios';
import config from 'config';
const { expect } = chai;

const port = config.get('port');
const url = `http://localhost:${port}/api/search`;

describe('/search - nlp features', () => {

	// NOTE mainly used as indicator that the system tests fail due to missing data
	it('should match something with some letter', () => {
		// Matthias taken from first test content entry
			return axios.get(url + '?q=Matthias')
				.then((res) => {
					const results = res.data;
					expect(results).to.have.length.at.least(1);
				});
	});

	it('should match the term öko-sozial phonetically with öko-sohzial', () => {
		return axios.get(url + '?q=öko-sohzial')
			.then((res) => {
				const results = res.data;
				expect(results).to.have.length(1);
        expect(results[0].match.section.value).to.include('<em>sozial</em>');
			});
	});

	it('should not match the term ökor-sozial by an unusual inflection', () => {
		return axios.get(url + '?q=ökor-sozial')
			.then((res) => {
				const results = res.data;
				expect(results).to.be.empty;
			});
	});

	it('should match the term Plastikflaschen via Plastik', () => {
		return axios.get(url + '?q=Plastik')
			.then((res) => {
				const results = res.data;
				expect(results).to.have.length.at.least(1);
        expect(results[0].match.section.value).to.include('<em>Plastikflaschen</em>');
			});
	});

	it('should match the adjective klimaneutrale via Klima', () => {
		return axios.get(url + '?q=Klima')
			.then((res) => {
				const results = res.data;
				expect(results).to.have.length.at.least(1);
        expect(results[0].match.section.value).to.include('klimaneutrale');
			});
	});

	it('should match the term \'Grundeinkommen\' with the phrase \'faire Einkommensverteilung\'', () => {
		// Klara Goldfaden's story
		return axios.get(url + '?q=faire Einkommensverteilung')
			.then((res) => {
				const results = res.data;
				expect(results).to.have.length(1);
        expect(results[0].match.section.value).to.include('<em>Grundeinkommen</em>');
			});
	});

	// it('should match the adjective nachhaltig with its noun equivalent', () => {
	// 	// Klara Goldfaden's story
	// 	return axios.get(url + '?q=Nachhaltigkeit')
	// 		.then((res) => {
	// 			const results = res.data;
	// 			expect(results).to.have.length(1);
  //       expect(results[0].match.section.value).to.include('<em>nachhaltiger Kleidung</em>');
	// 		});
	// });

	// it('should match Fahrradwege with text sections about mobility with bicycles', () => {
	// 	return axios.get(url + '?q=Fahrradwege')
	// 		.then((res) => {
	// 			const results = res.data;
	// 			expect(results).to.have.length(1);
	// 			expect(results[0].match.section.value).to.include('fahren mit');
  //       expect(results[0].match.section.value).to.include('Rad');
	// 		});
	// });

	// it('should match the term klimaneutral via Umwelt', () => {
	// 	return axios.get(url + '?q=Umwelt')
	// 		.then((res) => {
	// 			const results = res.data;
	// 			expect(results).to.have.length(1);
  //       expect(results[0].match.section.value).to.include('<em>sozial</em>');
	// 		});
	// });
	//
	// it('should match Finanzen with text about money', () => {
	// 	return axios.get(url + '?q=Finanzen')
	// 		.then((res) => {
	// 			const results = res.data;
	// 			expect(results).to.have.length(1);
  //       expect(results[0].match.section.value).to.include('Geld');
	// 		});
	// });
});
