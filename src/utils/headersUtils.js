export const headersPrefix = 'rus';
/* 上传业务中需要的加签头 */
// eslint-disable-next-line no-unused-vars
const HEADERS = [
  `${headersPrefix}-timestamp`,
  `${headersPrefix}-app-key`,
  `${headersPrefix}-upload-type`,
  `${headersPrefix}-upload-file-name`,
  `${headersPrefix}-signature-headers`,
  `${headersPrefix}-upload-single`,
  `${headersPrefix}-upload-server-ip`,
  `${headersPrefix}-signature`
];

export const getUploadHeadersSignature = (headers) => headers[`${headersPrefix}-signature`];

export const getAppkeyAndTypeByHeader = (headers) => ({
  appKey: headers[`${headersPrefix}-app-key`],
  uploadType: headers[`${headersPrefix}-upload-type`]
});
