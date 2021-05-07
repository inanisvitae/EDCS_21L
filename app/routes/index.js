import { Router } from 'express';
import operation from './operation';

export default (peer) => {
  const router = Router();
  operation(router, peer);
  return router;
};
