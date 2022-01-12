import { throwUploadErr } from '../utils/uploadResponse';
import { headersPrefix } from '../utils/headersUtils';
import { encodeUploadHeadersSignature } from '../utils/cryptoUtils';
import { checkNullObj } from '../utils';
import AppsType from '../models/AppsType';
import Apps from '../models/Apps';
import { sequelize } from '../utils/sequelize';

export async function uploadHeadersValidator(ctx, next) {
  // TODO 待移除
  console.log('ctx', ctx);
  // eslint-disable-next-line no-unused-vars
  const { headers, body } = ctx.request;
  const length = headers['content-length'];
  // !"0" 为true，所以使用==
  if (length === '0') {
    throwUploadErr('200002');
  }
  const appKey = headers[`${headersPrefix}-app-key`];
  const uploadType = headers[`${headersPrefix}-upload-type`];
  // 通过 UPLOAD_TYPE 获取到app信息
  const appInfo = await AppsType.findOne({
    where: { name: uploadType },
    raw: true,
    include: {
      model: Apps,
      as: 'app',
      attributes: []
    },
    attributes: {
      include: [
        // 扁平化 app 数据
        [sequelize.col('app.name'), 'appName'],
        [sequelize.col('app.secret'), 'appSecret']
      ]
    }
  });
  // 检测appKey or uploadType 是否符合标准
  if (!appInfo) {
    throwUploadErr('900001');
  }
  const { appName, appSecret } = appInfo;
  if (appName !== appKey) {
    throwUploadErr('900001');
  }
  // 生成签名
  const signature = encodeUploadHeadersSignature({
    headers,
    appSecret,
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
