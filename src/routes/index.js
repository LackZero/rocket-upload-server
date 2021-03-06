// 存放路由文件
import Router from '@koa/router';
import config from '../../config';
import upload from './upload';
import errors from './errors';
import apps from './apps';
import tem from './tem';

const { apiPrefix } = config;

const router = new Router({ prefix: apiPrefix });

router.use(upload.routes());
router.use(errors.routes());
router.use(apps.routes());
router.use(tem.routes());

export default router;
