import operationController from '../../controllers/operations';

export default (router) => {
  router.post('/get', operationController.get);
  router.post('/add', operationController.set);
  router.post('/delete', operationController.del);
  router.post('/showAll', operationController.showAll);
  router.post('/join', operationController.join);
};
