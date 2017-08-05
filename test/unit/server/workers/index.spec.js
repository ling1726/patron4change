import config from 'config';
import { assert } from 'chai';
import queue from '../../../../server/utils/queue';
import runWorkers from '../../../../server/workers';

function assertTasksProcessed(q, count, cb) {
  const check = () => {
    assert.equal(q.getStats().total, count);
    q.resetStats();
    q.removeListener('drain', check);
    cb();
  };
  q.on('drain', check);
}

describe('Workers', () => {

  before(() => {
    runWorkers(config.get('queues'), { log: () => {} });
  });

  it('should have a queue for each entry in config', () => {
    const queueDefs = config.get('queues');
    const queues = [];
    queueDefs.forEach(queueDef => {
      const q = queue(queueDef.name);
      if ('undefined' !== typeof q) {
        queues.push(q);
      }
    });
    assert.lengthOf(queues, queueDefs.length);
  });

  it('should process tasks', done => {
    const q = queue('updateSearchIndex');
    let taskCount = 0;
    q.push({id: ++taskCount});
    q.push({id: ++taskCount});
    assertTasksProcessed(q, taskCount, done);
  });

  it('should process duplicate tasks only once', done => {
    const q = queue('updateSearchIndex');
    let taskCount = 0;
    q.push({id: ++taskCount});
    q.push({id: ++taskCount});
    q.push({id: taskCount});
    assertTasksProcessed(q, taskCount, done);
  });

});
