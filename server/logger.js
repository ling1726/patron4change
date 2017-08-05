import winston from 'winston';
import moment from 'moment';
import colors from 'colors/safe';

/**
* instantiates a contextual logger
* @param requestId {String} may be null, if given indicates the request id to correlate log messages with
* @returns logger instance
*/
export default (requestId) => {

  // RFC5424 log levels + silly
  const priority = {
    emerg: 0,
    alert: 1,
    crit: 2,
    error: 3,
    warning: 4,
    notice: 5,
    info: 6,
    debug: 7,
    silly: 8
  };

  function formatter(options) {
    let time = options.timestamp();
    let lvl = options.level.toUpperCase();
    let lvlLower = options.level.toLowerCase();
    if (7 > priority[lvlLower]) {
      lvl = colors.bold(lvl);
    }

    let msg = options.message ? options.message : '';
    let { reqId } = options.meta;
    let subUuid = reqId ? reqId.substring(0, 6) : '';
    let pairs = Object.keys(options.meta).filter(k => 'reqId' !== k).reduce((ctx, key) => {
      return `${ctx} ${key}=${options.meta[key]}`;
    }, '');

    const lines = [
      `${colors.dim(time)} ${subUuid} ${lvl}` + (reqId ? ` | req: ${reqId || '-'}` : ''),
      colors.grey(msg),
      colors.italic(pairs)
    ];
    return lines.reduce((ctx, next, i) => {
      if (!next) {
        return ctx;
      }
      return ctx + (0 < i ? '\t' : '') + next.replace(/\s+/ig, ' ') + '\n';
    }, '');
  }

  function timestamp() {
    return moment().format('YYYY-MM-DD HH:mm:ss:SSS');
  }

  const logger = new winston.Logger({
    transports: [
      new winston.transports.Console({
        level: 'debug',
        handleExceptions: true,
        humanReadableUnhandledException: true,
        colorize: true,
        formatter,
        timestamp
      }),
      new winston.transports.File({
        name: 'fileinfo',
        filename: 'logs/info.log',
        level: 'info',
        maxsize: 128 * 1024,
        maxFiles: 10,
        formatter,
        timestamp
      }),
      new winston.transports.File({
        name: 'fileerror',
        filename: 'logs/error.log',
        level: 'error',
        handleExceptions: true,
        humanReadableUnhandledException: true,
        maxsize: 128 * 1024,
        maxFiles: 10,
        formatter,
        timestamp
      })
    ],
    exitOnError: false
  });

  logger.rewriters.push((lvl, msg, meta) => {
    meta.reqId = requestId;
    return meta;
  });

  return logger;
};
