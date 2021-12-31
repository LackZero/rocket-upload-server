import crypto from 'crypto';
import querystring from 'querystring';

const DELIMIT = '|';

/* 对body进行md5 ， 获取其base64 */
const getBodyBase64Md5 = (bodyData) => {
  if (!bodyData) return '';
  const str = JSON.stringify(bodyData);
  const md5 = crypto.createHash('md5');
  md5.update(str);
  return md5.digest('base64');
};

/* 对json对象序列化 */
const serializeObject = (obj) => querystring.stringify(obj);

/* 获取要签名的headers */
const getHeaderPlainText = (headers, needSignHeaderKeys) => {
  const data = {};
  needSignHeaderKeys.forEach((key) => {
    data[key] = headers[key] || '';
  });
  return querystring.stringify(data);
};

/**
 * @desc 通过签名算法对请求参数签名
 * @param appSecret
 * @param headers
 * @param bodyData
 * @param queryData
 * @param needSignHeaderKeys
 * @returns {string}
 */
export const encodeUploadHeadersSignature = ({
  appSecret = '',
  headers,
  bodyData = '',
  queryData = '',
  needSignHeaderKeys = []
}) => {
  // eslint-disable-next-line no-shadow
  function getSignPlainText({ bodyData, queryData }) {
    return `POST${DELIMIT}${getBodyBase64Md5(bodyData)}${DELIMIT}${getHeaderPlainText(
      headers,
      needSignHeaderKeys
    )}${DELIMIT}${serializeObject(queryData)}`;
  }

  const signPlainText = getSignPlainText({
    bodyData,
    queryData
  });
  const secret = Buffer.from(appSecret, 'base64');
  const hmac = crypto.createHmac('sha256', secret.toString());
  const signature = hmac.update(signPlainText);
  return signature.digest('base64');
};

// 加密解密的类型
const appKeyAlgorithm = 'aes-256-ctr';

/**
 * @desc 给 appKey 进行加密，生成APP_SECRET
 * @param appKey
 * @param {string} key 加密解密的密钥：密钥必须是 8/16/32 位，
 * @param {string} [iv] 初始向量，规则与 key 一样
 * @returns {{cipherText: string, iv: string}}
 */
export function encodeAppKeyToSecret(appKey, key, iv) {
  const newIv = iv || crypto.randomBytes(8).toString('hex');
  const cipher = crypto.createCipheriv(appKeyAlgorithm, key, newIv);
  let cipherText = cipher.update(appKey, 'utf8', 'hex');
  cipherText += cipher.final('hex');
  return {
    iv: newIv,
    cipherText
  };
}

/**
 * @desc 给APP_SECRET 进行解密，（暂时没啥意义
 * @param {string} cipherText 密文
 * @param {string} key 加密解密的密钥
 * @param {string} iv 初始向量规则与 key 一样
 * @returns {string}
 */
export function decodeAppKeySecret(cipherText, key, iv) {
  const cipher = crypto.createDecipheriv(appKeyAlgorithm, key, iv);
  let src = cipher.update(cipherText, 'hex', 'utf8');
  src += cipher.final('utf8');
  return src;
}
