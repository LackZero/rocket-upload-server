// 增加错误例子

export async function handleCtxThrowError(ctx) {
  const { code } = ctx.request.query;
  if (code) {
    ctx.throw(code, `ctx.throw ${code}`);
  } else {
    ctx.throw(`no code ctx.throw ${code}`);
  }
}

export async function handleThrowError(ctx) {
  const { code } = ctx.request.query;
  const err = new Error(`throw ${code} required`);
  if (code) err.status = Number(code);
  console.error('CustomError: print custom error \n %s ', err);
  // err.expose = true;
  throw err;
}

export async function handlePrintError(ctx) {
  // 记录打印的日志错误
  const { msg } = ctx.request.body;
  throw new Error(msg);
}
