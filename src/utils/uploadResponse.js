// 定义upload的错误类型

const uploadCodeList = {
  '000000': {
    code: '000000',
    type: 'Normal',
    msg: '已完成'
  },
  // 大文件合并的正常返回，不会返回给用户，返回给调用方，调用方会自动执行下一个请求
  100016: {
    code: '100016',
    type: 'IS_IN_COMBINE',
    msg: '文件合并中'
  },
  900001: {
    code: '900001',
    type: 'HTTP_SIGN_ERROR',
    msg: 'HTTP验签异常'
  }
};

/**
 * @desc 上传时扔出错误
 * @param {string} code 错误Code
 */
export function throwUploadErr(code) {
  const obj = { ...uploadCodeList[code] };
  throw new Error(`上传文件失败，${JSON.stringify(obj)}`);
}

// 上传的反馈
export const uploadResponse = {
  success: (ctx, data) => {
    ctx.response.body = {
      code: '000000',
      data
    };
  },
  info: (ctx, code) => {
    const obj = { ...uploadCodeList[code] };
    ctx.response.body = {
      ...obj
    };
  }
};
