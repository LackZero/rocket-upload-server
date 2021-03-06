import Router from '@koa/router';
import {
  handleAddNewApp,
  handleDelAppInfoById,
  handleEditAppInfoById,
  handleGetAllApps,
  handleGetAppInfoById
} from '../controllers/apps';
import validatorMiddleware from '../middlewares/validator';
import { addAppValidators, editAppValidators } from '../validators/apps';

// 如果一个方法重复执行多次，产生的效果是一样的，那就是idempotent的
// 在HTTP中，PUT被定义为idempotent的方法，POST则不是
// https://blog.csdn.net/mad1989/article/details/7918267
// https://stackoverflow.com/questions/630453/what-is-the-difference-between-post-and-put-in-http

const router = new Router({ prefix: '/apps' });

router.get('/list', handleGetAllApps);
router.post('/add', validatorMiddleware(addAppValidators), handleAddNewApp);
router.get('/get/:id', handleGetAppInfoById);
router.put('/edit/:id', validatorMiddleware(editAppValidators), handleEditAppInfoById);
router.del('/del/:id', handleDelAppInfoById);

export default router;
