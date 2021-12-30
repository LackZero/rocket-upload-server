import { throwUploadErr } from '../utils/uploadResponse';
import { headersPrefix } from '../utils/headersUtils';
import config from '../../config';
import { encodeUploadHeadersSignature } from '../utils/cryptoUtils';
import { checkNullObj } from '../utils';

// TODO 加签校验
export async function uploadHeadersValidator(ctx, next) {
  console.log('ctx', ctx);
  // eslint-disable-next-line no-unused-vars
  const { headers, body } = ctx.request;
  console.log('body', body);
  const length = headers['content-length'];
  // !"0" 为true，所以使用==
  if (length === '0') {
    throwUploadErr('200002');
  }
  const appKey = headers[`${headersPrefix}-app-key`];
  const uploadType = headers[`${headersPrefix}-upload-type`];
  const appConfig = config.uploadApp[appKey];
  // 检测appKey or uploadType 是否符合标准
  if (!appConfig) {
    throwUploadErr('900001');
  }
  if (!(appConfig.uploadType || []).includes(uploadType)) {
    throwUploadErr('900001');
  }
  // 生成签名
  const signature = encodeUploadHeadersSignature({
    headers,
    appSecret: appConfig.secret,
    bodyData: checkNullObj(body) ? '' : body,
    queryData: '',
    needSignHeaderKeys: headers[`${headersPrefix}-signature-headers`].split(',')
  });
  // 检测签名是否一致
  if (signature !== headers[`${headersPrefix}-signature`]) {
    throwUploadErr('900001');
  }

  await next();
}
