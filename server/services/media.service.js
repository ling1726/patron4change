import { Client } from 'minio';
import coconut from 'coconutjs';
import uuid from 'uuid';
import _ from 'lodash';

export default class {

  constructor(storageConfig, coconutConfig) {
    this.minioClient = new Client({
      endPoint: storageConfig.host,
      // port: storageConfig.port,
      secure: true,
      accessKey: storageConfig.accessKey,
      secretKey: storageConfig.secretKey
    });
    this.bucketName = storageConfig.bucketName;
    this.coconutConfig = coconutConfig;
    this.coconutQ = {};
  }

  _processVideo(objectName) {
    const validity = 24 * 60 * 60; // 1 day
    const coconutQ = this.coconutQ;
    return new Promise((resolve, reject) => {
      this.minioClient.presignedGetObject(this.bucketName, objectName, validity, (err, url) => {
        if (err) {
          return reject(err);
        }
        return resolve(url);
      });
    })
    .then(url => {
      return new Promise((resolve, reject) => {
        coconut.createJob({
          'api_key': this.coconutConfig.apiKey,
          source: url,
          webhook: this.coconutConfig.webhookTemplate.replace('{objectName}', `${objectName}`),
          outputs: {
            'mp4:240p': this.coconutConfig.outputUrlTemplate.replace('{objectName}', `${objectName}_240p.mp4`),
            'dash': this.coconutConfig.outputUrlTemplate.replace('{objectName}', `${objectName}_playlist.mpd`)
              + ', variants=mp4:x:64k,mp4:x,mp4:240p_400k:x,mp4:360p_600k:x,mp4:480p_1500k:x,mp4:720p:x'
          }
        }, function(job) {
          if('ok' === job.status) {
            coconutQ[job.id] = {
              objectName: objectName,
              resolve: resolve,
              reject: reject
            };
          } else {
            reject(job.error_message);
          }
        });
      });
    });
  }

  postProcessors = {
    video: this._processVideo
  };

	upload(data, type) {
    return new Promise((resolve, reject) => {
      const objectName = uuid();
      this.minioClient.putObject(this.bucketName, objectName, data, (err, etag) => {
        if (err) {
          return reject(err);
        }
        return resolve(objectName, etag);
      });
    })
    .then(objectName => {
      const postProcessor = this.postProcessors[type] || Promise.resolve;
      return postProcessor.bind(this)(objectName);
    });
  }

  encodingDone(objectName, payload) {
    const job = this.coconutQ[payload.id];
    if (objectName === job.objectName) {
      if ( ! _.isEmpty(payload.errors)) {
        job.reject(payload.errors);
      } else {
        job.resolve(payload.output_urls.dash);
      }
    } else {
      job.reject('got wrong objectName');
    }
  }
}
