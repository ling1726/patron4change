/**
* this middleware captures promises in actions and dispatches
* - a request action on start of the promise
* - a success action if the promise resolves
* - an error action if the promise rejects
*
* use this to handle server requests that could fail
*/
export default function promiseMiddleware( /* objMethods */ ) {
  return (next) => (action) => {

    const { promise, types, ...rest } = action;

    if (!promise) {
      return next(action);
    }

    const [REQUEST, SUCCESS, ERROR] = types;

    next({ ...rest, type: REQUEST });
    return promise.then(
      (result) => next({ ...rest, result, type: SUCCESS }),
      (error) => next({ ...rest, error, type: ERROR })
    );
  };
}
