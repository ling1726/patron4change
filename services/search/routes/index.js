import express from 'express';
import profile from './profile';
import search from './search';
import suggest from './suggest';

const router = express.Router();
export default router;

router.use('/profile', profile);
router.use('/search', search);
router.use('/suggest', suggest);

router.get('/', (req, res) => {
  res.sendStatus(204);
});
