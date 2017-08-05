import Queue from 'better-queue';

const queues = new Map();

export default (name, config, fn) => {
  let queue = queues.get(name);
  if ('undefined' === typeof queue && 'function' === typeof fn) {
    queue = new Queue(fn, config);
    queues.set(name, queue);
  }
  return queue;
}
