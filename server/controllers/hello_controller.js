/**
 * @author Candice
 * @date 2018/6/21 19:46
 */
import express from 'express';

const router = express.Router();
router.get('/', (req, res) => {
  res.send('hello world!!!');
});

export default router;
