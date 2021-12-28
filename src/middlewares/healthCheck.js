// 健康检查的中间件

import config from '../../config';

async function healthCheck(ctx, next) {
  if (ctx.path === `/${config.name}/health-check`) {
    ctx.body = 'Success!';
  } else {
    await next();
  }
}

export default healthCheck;
