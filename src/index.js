import Koa from 'koa';
import ip from 'ip';
import koaBody from 'koa-body';
import koaStaticCache from 'koa-static-cache';
import logger from 'koa-logger';
import path from 'path';
import config from '../config';
import router from './routes';
import healthCheck from './middlewares/healthCheck';
import errorHandler from './middlewares/errors';

const { port, apiDocPrefix } = config;

const app = new Koa();

// 错误捕捉，放在顶部位置
app.use(errorHandler);

// TODO: 替换为自己的日志打印
app.use(logger());

// 健康检查
app.use(healthCheck);

// body 解析
app.use(
  koaBody({
    // 是否支持 multipart-formdata 的表单
    multipart: true,
    // delete 可以有body参数
    parsedMethods: ['POST', 'PUT', 'PATCH', 'DELETE']
  })
);

// 缓存 apiDoc的静态资源，打开网址即可访问到：http://localhost:3000/apidoc/index.html
app.use(
  koaStaticCache(path.resolve(__dirname, '../apidoc'), {
    prefix: apiDocPrefix // 如果当前请求的url是以 /public开始，则作为静态资源请求
  })
);

// 加载路由信息
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(port, () => {
  const text = `
   App running at:
    - Local:   http://localhost:${port} 
    - Network: http://${ip.address()}:${port}
    - ApiDoc: http://${ip.address()}:${port}${apiDocPrefix}/index.html (you can open it)
  `;
  console.log(text);
});
