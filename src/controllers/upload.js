import ip from 'ip';
import { combineChunkFile, uploadChunkFile } from '../services/upload';
import { uploadResponse } from '../utils/uploadResponse';

// 目前 所用Content-Type: application/octet-stream，所以使用getRawBody方法
export async function handleUploadChunkFile(ctx) {
  const { md5, fileName } = await uploadChunkFile(ctx);
  uploadResponse.success(ctx, { md5, ctx: fileName, serverIp: ip.address() });
  // console.log('file', ctx.request.body.files.file);
}

// 合并文件
export async function handleCombineChunkFile(ctx) {
  const data = ctx.request.body;
  combineChunkFile(data);
  uploadResponse.info(ctx, '100016');
}

// 获取合并文件的状态
export async function handleGetCombineChunkStatus(ctx) {
  console.log('handleGetCombineChunkStatus', ctx.request.body);
}
