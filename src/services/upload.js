import getRawBody from 'raw-body';
import crypto from 'crypto';
import path from 'path';
import { writeFile } from 'fs/promises';
import fse from 'fs-extra';

import config from '../../config';

/**
 * @desc 解析文件
 * 目前 所用Content-Type: application/octet-stream，所以使用getRawBody方法,
 * getRawBody-->在request流中，使用stream流模块中data、end事件来完成文件读写：
 * @param ctx
 * @returns {Promise<Buffer>}
 */
export async function parseFile(ctx) {
  const { headers } = ctx.request;
  // console.log('request', ctx.req);
  // 因为遇到stream.on is not a function ，所以将第一个参数ctx.request改为ctx.req
  // 参考 https://segmentfault.com/q/1010000011450685
  const result = await getRawBody(ctx.req, {
    // limit: '1mb',
    // encoding: ctx.request.charset,
    length: headers['content-length']
  });
  return result;
}

/**
 * @desc 生成切片md5
 * @param buffer
 * @returns {string}
 */
function createChunkMD5(buffer) {
  const md5Crypto = crypto.createHash('md5');
  md5Crypto.update(buffer);
  return md5Crypto.digest('hex');
}

// 保存buffer至指定的磁盘路径
async function saveBufferToDir(md5, buffer) {
  try {
    const dir = path.resolve(config.assetsPath, './tem');
    // 不存在自动新建，并返回路径
    const dirPath = (await fse.ensureDir(dir)) || dir;
    const name = `./${md5}_chunk`;
    const filePath = path.resolve(dirPath, name);
    // 写入文件，对于性能敏感的代码，则考虑使用 fs.createWriteStream()。
    await writeFile(filePath, buffer);
    console.log('保存文件成功');
  } catch (e) {
    console.log(`saveBufferError: 保存文件${md5}失败\n`, e);
  }
}
// 上传切片文件
export async function uploadChunkFile(ctx) {
  const buffer = await parseFile(ctx);
  const md5 = createChunkMD5(buffer);
  saveBufferToDir(md5, buffer);
  return md5;
}
