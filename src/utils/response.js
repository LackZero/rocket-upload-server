// 返回的结果格式化
const response = {
  success: (ctx, data) => {
    ctx.response.body = {
      ret: 0,
      data
    };
  },
  info: (ctx, msg, ret) => {
    ctx.response.body = {
      ret: ret || 100,
      msg
    };
  },
  error: (ctx, msg, ret) => {
    ctx.response.body = {
      ret: ret || 300,
      msg
    };
  }
};

export default response;
