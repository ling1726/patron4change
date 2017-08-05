import express from 'express';
import controller from './controller';

const maxQueryLen = 256;

export default (searchSvc) => {

  const router = express.Router();

  router.get('/', controller(({ q }) => {
    if (q && maxQueryLen < q.length) {
      return { status: 400, message: `parameter q too long - maximum ${maxQueryLen} characters allowed` };
    }
    return searchSvc.search(q);
  }));

  return router;
}
