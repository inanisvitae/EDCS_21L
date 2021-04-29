import { Router } from 'express';
import operation from './operation';

export default () => {
  const router = Router();
  operation(router);
  return router;
};
