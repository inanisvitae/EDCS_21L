import operationController from '../../controllers/operations';

export default (router) => {
  router.post('/get', operationController.get);
  router.post('/add', operationController.add);
  router.post('/delete', operationController.del);
  router.post('/showAll', operationController.showAll);
}