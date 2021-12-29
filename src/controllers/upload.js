import ip from 'ip';
import { combineChunkFile, getUploadCombineStatusKey, uploadChunkFile } from '../services/upload';
import { throwUploadErr, uploadResponse } from '../utils/uploadResponse';
import { getUploadHeadersSignature } from '../utils/headersUtils';
import { getRedisItem, setRedisItem } from '../utils/temRedis';

// 目前 所用Content-Type: application/octet-stream，所以使用getRawBody方法
export async function handleUploadChunkFile(ctx) {
  const { md5, fileName } = await uploadChunkFile(ctx);
  uploadResponse.success(ctx, { md5, ctx: fileName, serverIp: ip.address() });
  // console.log('file', ctx.request.body.files.file);
}

// 合并文件
export async function handleCombineChunkFile(ctx) {
  const data = ctx.request.body;
  const signature = getUploadHeadersSignature(ctx.request.headers);
  setRedisItem(`${signature}_data`, data);
  // TODO 增加定时器，1S 中没响应直接返回100016，否则返回成功合并
  combineChunkFile(data, signature);
  uploadResponse.info(ctx, '100016');
}

// 获取合并文件的状态
export async function handleGetCombineChunkStatus(ctx) {
  const { statusKey } = ctx.request.query;
  const status = getRedisItem(getUploadCombineStatusKey(statusKey));
  switch (status) {
    case 'combining':
      uploadResponse.info(ctx, '100016');
      break;
    case 'success':
      uploadResponse.success(ctx, '合并成功');
      break;
    case 'fail':
    default:
      throwUploadErr('800003');
      break;
  }
}
