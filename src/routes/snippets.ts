import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.send({ message: 'Snippets route' });
});

export default router;
