// 错误中间件：捕获错误
async function errorHandler(ctx, next) {
  try {
    await next();
  } catch (err) {
    // 对外展示错误信息
    // will only respond with JSON
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = {
      msg: err.message
    };
    // ctx.app.emit('error', err, ctx);
    // throw err;
    // 打印错误信息
    console.error('\n%s', err);
  }
}

export default errorHandler;
