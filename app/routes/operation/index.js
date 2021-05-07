import operationController from '../../controllers/operations';

export default (router, peer) => {
  router.post('/get', operationController.get(peer));
  router.post('/set', operationController.set(peer));
  router.post('/delete', operationController.del(peer));
  router.post('/showAll', operationController.showAll(peer));
  router.post('/join', operationController.join(peer));
  router.post('/info', operationController.info(peer));
  router.post('/ping', operationController.ping(peer));
};
