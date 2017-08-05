import http from 'request-promise';
import { assert } from 'chai';
import { baseUrl } from './service';

export default () => {
  it('should respond to /', (done) => {
    http({
      uri: baseUrl + '/',
      resolveWithFullResponse: true
    })
    .then((result) => {
      assert.equal(result.statusCode, 204);
      done();
    })
    .catch(done);
  });
};
