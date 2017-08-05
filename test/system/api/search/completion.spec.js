import http from 'request-promise';
import { expect } from 'chai';
import { baseUrl } from './service';

export default () => {

  const words = [
    'amalgamable',
    'amaxophobia',
    'ambiguous',
    'amplification',
    'barricading'
  ];

  const type = 'changemaker';
  const urlPath = `/profile/${type}/`;
  const ids = [];

  before((done) => {
    let id = 1;
    Promise.all(words.map((word) => {
      ids.push(id);
      return http({
        uri: baseUrl + urlPath + id++,
        method: 'PUT',
        body: {
          firstName: 'foo',
          lastName: 'bar',
          suggest: word
        },
        json: true
      });
    }))
    .then(() => {
      // There is a latency until new entries becomes searchable
      setTimeout(done, 1000);
    })
    .catch(done);
  });

  after(() => {
    ids.forEach((id) => {
      return http({
        uri: baseUrl + urlPath + id,
        method: 'DELETE'
      });
    });
  });

  let prefixes = new Map();
  words.forEach((word) => {
    for (let i = 1; 3 >= i; i++) {
      const prefix = word.substr(0, i);
      prefixes.set(prefix, prefixes.get(prefix) || []);
      prefixes.get(prefix).push(word);
    }
  });

  it('should have terms for completion', (done) => {
    expect(prefixes.size).to.be.above(0);
    done();
  });

  prefixes.forEach((wordsKey, prefix) => {
    it('should return completions for: ' + prefix, (done) => {
      http({
        uri: baseUrl + '/suggest/' + type,
        qs: {
          q: prefix
        },
        method: 'GET',
        json: true
      })
      .then( result => {
        expect(result).to.include.members(wordsKey);
        done();
      })
      .catch(done);
    });
  });

};
