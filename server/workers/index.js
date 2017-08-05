import queue from '../utils/queue';

export default function (queues, logger) {
  queues.forEach(queueDef => {
    const fn = require('./' + queueDef.name);
    function handler(...args) {
      logger.log('debug', `worker ${queueDef.name} executing`);
      fn(...args);
    }
    queue(queueDef.name, queueDef.config, handler);
  });
}
