import express from 'express';

const router = express.Router();

router.get('/', (_req, res) => {
  res.redirect(301, 'https://api.nitropay.com/v1/ads-2290.txt');
});

export default router;
