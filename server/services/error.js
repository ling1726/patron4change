// http://stackoverflow.com/questions/31089801/extending-error-in-javascript-with-es6-syntax
class ExtendableError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    if ('function' === typeof Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error(message)).stack;
    }
  }
}

export class ValidationError extends ExtendableError {
  constructor(m) {
    super(m);
    this.name = 'ValidationError';
  }
}
