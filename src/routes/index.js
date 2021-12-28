// 存放路由文件
import Router from '@koa/router';
import config from '../../config';
import upload from './upload';

const { apiPrefix } = config;

const router = new Router({ prefix: apiPrefix });

router.use(upload.routes());

export default router;
