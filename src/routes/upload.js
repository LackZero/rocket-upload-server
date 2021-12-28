import Router from '@koa/router';
import { handleUpdateFootball } from '../controllers/upload';

const router = new Router({ prefix: '/upload' });

/**
 * @api {POST} /upload/file/backend/blk 上传分片文件
 * @apiGroup  upload
 * @apiDescription 上传分片文件
 *
 *
 * @apiUse success
 * @apiSuccess {string} data 返回数据
 * @apiSuccessExample  {json} 成功示例
 * {
 *   "ret":0,
 *   "data": "success"
 * }
 *
 * @apiUse error
 */
router.post('/file/backend/blk', handleUpdateFootball);
/**
 * @api {POST} /upload/merge/backend/mkfile 合并文件
 * @apiGroup  upload
 * @apiDescription 合并文件
 *
 *
 * @apiUse success
 * @apiSuccess {string} data 返回数据
 * @apiSuccessExample  {json} 成功示例
 * {
 *   "ret":0,
 *   "data": "success"
 * }
 *
 * @apiUse error
 */
router.post('/merge/backend/mkfile', handleUpdateFootball);
/**
 * @api {POST} /upload/merge/status 获取合并文件的状态
 * @apiGroup  upload
 * @apiDescription 获取合并文件的状态
 *
 *
 * @apiUse success
 * @apiSuccess {string} data 返回数据
 * @apiSuccessExample  {json} 成功示例
 * {
 *   "ret":0,
 *   "data": "success"
 * }
 *
 * @apiUse error
 */
router.post('/merge/status', handleUpdateFootball);

export default router;
