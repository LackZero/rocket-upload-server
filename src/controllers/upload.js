import ip from 'ip';
import { uploadChunkFile } from '../services/upload';

const uploadResponse = (ctx, data) => {
  ctx.response.body = {
    code: '000000',
    data
  };
};
// 目前 所用Content-Type: application/octet-stream，所以使用getRawBody方法
export async function handleUploadChunkFile(ctx) {
  const md5 = await uploadChunkFile(ctx);
  uploadResponse(ctx, { md5, serverIp: ip.address() });
  // console.log('file', ctx.request.body.files.file);
}

// 合并文件
export async function handleCombineChunkFile(ctx) {
  console.log('ctx', ctx);
}

// 获取合并文件的状态
export async function handleGetCombineChunkStatus(ctx) {
  console.log('ctx', ctx);
}
