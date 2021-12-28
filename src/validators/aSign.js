const prefix = 'x-xfm';
/* 上传业务中需要的加签头 */
// eslint-disable-next-line no-unused-vars
const HEADERS = [
  `${prefix}-timestamp`,
  `${prefix}-app-key`,
  `${prefix}-upload-type`,
  `${prefix}-upload-file-name`,
  `${prefix}-signature-headers`,
  `${prefix}-upload-single`,
  `${prefix}-upload-server-ip`,
  `${prefix}-signature`
];
// TODO 加签校验
export async function uploadSignedHeadersValidator(ctx, next) {
  console.log('ctx', ctx);
  // eslint-disable-next-line no-unused-vars
  const { headers } = ctx.request;
  await next();
}
