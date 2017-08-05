import express from 'express';
import complete from '../strategies/completion';

const router = express.Router();
export default router;

router.get('/:type', (req, res) => {
  complete({
    type: req.params.type,
    q: req.query.q
  })
  .then((result) => {
    res.send(result);
  })
  .catch((err) => {
    res.status(500).send(err);
  });
});
