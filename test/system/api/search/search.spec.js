import http from 'request-promise';
import { assert } from 'chai';
import { baseUrl } from './service';

export default () => {

  const testId = '1';
  const words = ['spectacular', 'amazing', 'fantastic', 'magnificent'];
  const profile = {
    firstName: 'foo',
    lastName: 'bar',
    mission: words.join(' ')
  };

  before('insert a profile', (done) => {
    http({
      uri: baseUrl + '/profile/genericPerson/' + testId,
      method: 'PUT',
      body: profile,
      json: true
    })
    .then(() => {
      // There is a latency until the profile becomes searchable
      setTimeout(done, 1000);
    })
    .catch(done);
  });

  it('should find an inserted profile by first name', (done) => {
    http({
      uri: baseUrl + '/search/genericPerson',
      qs: {
        q: profile.firstName
      },
      method: 'GET',
      json: true
    }).then((result) => {
      assert.lengthOf(result, 1);
      done();
    }).catch(done);
  });

  it('should find an inserted profile by last name', (done) => {
    http({
      uri: baseUrl + '/search/genericPerson',
      qs: {
        q: profile.lastName
      },
      method: 'GET',
      json: true
    }).then((result) => {
      assert.lengthOf(result, 1);
      done();
    }).catch(done);
  });

  words.forEach((word) => {
    it('should find an inserted profile by a word contained in a field: ' + word, (done) => {
      http({
        uri: baseUrl + '/search/genericPerson',
        qs: {
          q: word
        },
        method: 'GET',
        json: true
      }).then((result) => {
        assert.lengthOf(result, 1);
        done();
      }).catch(done);
    });
  });

  it('shouldn\'t find a deleted profile', (done) => {
    http({
      uri: baseUrl + '/profile/genericPerson/' + testId,
      method: 'DELETE'
    })
    .then(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          http({
            uri: baseUrl + '/search/genericPerson',
            qs: {
              q: profile.firstName
            },
            method: 'GET',
            json: true
          })
          .then(resolve)
          .catch(reject);
        }, 1000);
      });
    })
    .then((result) => {
      assert.lengthOf(result, 0);
      done();
    })
    .catch(done);
  });
};
