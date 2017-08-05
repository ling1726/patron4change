/* eslint no-sync: 0 */
import chai from 'chai';
import swaggerTest from '../helper/swagger-test';
import yaml from 'yamljs';
import path from 'path';
import axios from 'axios';
import fs from 'fs';

const { expect, assert } = chai;

describe('api swagger', () => {

	function isPositiveSample(xample) {
		return 200 === xample.response.status;
	}

	const swaggerPath = path.join(__dirname, '../../public/definitions/swagger.yaml');
  const yamlSpec = fs.readFileSync(swaggerPath, 'utf-8');
  const swaggerSpec = yaml.parse(yamlSpec);
  const xamples = swaggerTest.parse(swaggerSpec);

  xamples.filter(isPositiveSample).forEach((xample) => {
    it(xample.description, () => {
      return axios[xample.request.method](xample.request.uri)
        .then((res) => {
          expect(res.status).to.equal(xample.response.status);
        })
        .catch((err) => {
					assert(false, err.response.statusText || 'Unknown error');
				});
    });
  });
});
