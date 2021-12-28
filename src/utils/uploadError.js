// 定义upload的错误类型

const errorList = {
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
  const obj = { ...errorList[code] };
  throw new Error(`上传文件失败，${JSON.stringify(obj)}`);
}
