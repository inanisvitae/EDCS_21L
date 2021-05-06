import operationController from '../../controllers/operations';

export default (router) => {
  router.post('/get', operationController.get);
  router.post('/set', operationController.set);
  router.post('/delete', operationController.del);
  router.post('/showAll', operationController.showAll);
  router.post('/join', operationController.join);
  router.post('/info', operationController.info);
  router.post('/ping', operationController.ping);
};
