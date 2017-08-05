import template from 'url-template';
import _ from 'lodash';

function statusToCode(status) {
  if ('number' === typeof status) {
    return status;
  }
  if ('default' === status) {
    return 500;
  }
  if (!isNaN(parseInt(status))) {
    return parseInt(status);
  }
  throw new Error('invalid swagger status: ' + status);
}

function sampleParameters(params) {
  return params.reduce((ctx, p) => {
    if ('body' === p.in) {
      return ctx;
    }
    ctx[p.name] = 'integer' === p.type ? 1 : 'a';
    return ctx;
  }, {});
}

function inferXample(spec, uri, method, operation, statusString) {

    let uriTemplate = template.parse(uri);
    let params = sampleParameters(operation.parameters || []);
    let expandedUri = uriTemplate.expand(params);

    expandedUri += '?';
    _.forEach(params, (val, key) => {
      expandedUri += `${key}=${val}`;
    });

    let request = {
        method: method,
        uri: spec.host + spec.basePath + expandedUri
    };
    let response = {
        status: statusToCode(statusString)
    };
    if (operation.produces && operation.produces[0]) {
        response.headers = {
            'content-type':  operation.produces[0]
        };
    }
    return {
        description: method + ' ' + uri,
        request: request,
        response: response
    };
}

function parse(spec) {

    let xamples = [];

    Object.keys(spec.paths || {}).forEach((uri) => {
        let path = spec.paths[uri];
        Object.keys(path).forEach((method) => {
            let operation = path[method];
            if ((operation.parameters || []).some(p => 'body' === p.in)) {
              return;
            }
            Object.keys(operation.responses || {}).forEach((statusString) => {
                xamples.push(inferXample(spec, uri, method, operation, statusString));
            });
        });
    });

    return xamples;
}

module.exports.parse = parse;
