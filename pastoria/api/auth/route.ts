import express from 'express';
import {toNodeHandler} from 'better-auth/node';
import {auth} from '#src/lib/server/auth.js';

const router = express.Router();

router.all('/*splat', (req, res, next) => {
  toNodeHandler(auth)(req, res).catch(next);
});

export default router;
