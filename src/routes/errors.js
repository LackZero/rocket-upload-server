import Router from '@koa/router';
import { handleCtxThrowError, handleThrowError, handlePrintError } from '../controllers/errors';

const router = new Router({ prefix: '/error' });

router.get('/ctx-throw', handleCtxThrowError);
router.get('/throw', handleThrowError);
router.post('/throw', handlePrintError);

export default router;
