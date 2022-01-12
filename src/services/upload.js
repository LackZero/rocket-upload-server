import getRawBody from 'raw-body';
import crypto from 'crypto';
import path from 'path';
import { createWriteStream } from 'fs';
import { writeFile } from 'fs/promises';
import fse from 'fs-extra';

import config from '../../config';
import { streamMergeRecursive } from '../utils/streamUtils';
import { setRedisItem } from '../utils/temRedis';
import { throwUploadErr } from '../utils/uploadResponse';
import { getAppkeyAndTypeByHeader } from '../utils/headersUtils';

/**
 * @desc 解析文件
 * 目前 所用Content-Type: application/octet-stream，所以使用getRawBody方法,
 * getRawBody-->在request流中，使用stream流模块中data、end事件来完成文件读写：
 * @param ctx
 * @returns {Promise<Buffer>}
 */
// eslint-disable-next-line consistent-return
export async function parseFile(ctx) {
  try {
    const { headers } = ctx.request;
    // console.log('request', ctx.req);
    // 因为遇到stream.on is not a function ，所以将第一个参数ctx.request改为ctx.req
    // 参考 https://segmentfault.com/q/1010000011450685
    const result = await getRawBody(ctx.req, {
      // limit: 1,
      // encoding: ctx.request.charset,
      length: headers['content-length']
    });
    return result;
  } catch (e) {
    if (e.type === 'entity.too.large') {
      throwUploadErr('100002');
    } else {
      throw e;
    }
  }
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

// 生成组合&分片路径的规则
function generateGroupAndChunkPathRules(appKey, uploadType) {
  return { group: `./${appKey}/${uploadType}/group`, chunk: `./${appKey}/${uploadType}/chunks` };
}

// 获取静态资源的根目录
async function getAssetsDirPath() {
  const dir = path.resolve(config.assetsPath, '');
  // 不存在自动新建，并返回的是第一个目录路径
  await fse.ensureDir(dir);
  // const dirPath = (await fse.ensureDir(dir)) || dir;

  return dir;
}

// 生成保存切割的文件目录(使用 appkey，uploadType
async function getSaveChunkDirPath(appKey, uploadType) {
  const assetsPath = await getAssetsDirPath();
  const { chunk } = generateGroupAndChunkPathRules(appKey, uploadType);
  const dir = path.resolve(assetsPath, chunk);
  // 不存在自动新建，并返回路径
  // 如果创建的话返回的是第一个目录路径
  // http://nodejs.cn/api/fs.html#fs_fs_mkdir_path_options_callback
  await fse.ensureDir(dir);

  return dir;
}

// 获取合并文件夹的根目录
async function getMergeGroupDirPath(appKey, uploadType) {
  const assetsPath = await getAssetsDirPath();
  const { group } = generateGroupAndChunkPathRules(appKey, uploadType);
  const dir = path.resolve(assetsPath, group);
  // 不存在自动新建，并返回路径
  await fse.ensureDir(dir);

  return dir;
}

// 生成文件名字（包含后缀
function createSaveFileName(fileName, fileExtName) {
  return fileExtName ? `${fileName}.${fileExtName}` : fileName;
}

// 根据name & ext & dir 获取 组合的filePath
function getFilePathWithDirAndNameAndExt(dirPath, fileName, fileExtName) {
  const fileInfoName = createSaveFileName(fileName, fileExtName);
  return path.resolve(dirPath, fileInfoName);
}

// 生成buffer对应的fileName
function createBufferFileName(md5) {
  return `${md5}_chunk`;
}

// 保存buffer至指定的磁盘路径
async function saveBufferToDir(dirPath, fileName, buffer) {
  try {
    const name = `./${fileName}`;
    const filePath = path.resolve(dirPath, name);
    // 写入文件，对于性能敏感的代码，则考虑使用 fs.createWriteStream()。
    await writeFile(filePath, buffer);
    console.log(`保存文件: ${fileName} 成功`);
  } catch (e) {
    console.error(`saveBufferError: 保存文件${fileName}失败\n`, e);
  }
}
// 上传切片文件
export async function uploadChunkFile(ctx) {
  const buffer = await parseFile(ctx);
  const md5 = createChunkMD5(buffer);
  const fileName = createBufferFileName(md5);
  const { appKey, uploadType } = getAppkeyAndTypeByHeader(ctx.request.headers);
  const dirName = await getSaveChunkDirPath(appKey, uploadType);
  console.log('dirName', dirName, appKey, uploadType);
  saveBufferToDir(dirName, fileName, buffer);
  return { md5, fileName };
}

// 合并文件
export async function combineChunkFile(data, signature) {
  // const data = {
  //   uid: 0,
  //   uploadType: 'aicenterImage',
  //   appkey: 'aicenter',
  //   fileSize: 4486582,
  //   fileExtName: 'png',
  //   fileName: '2',
  //   deviceType: 'web',
  //   clientIp: '',
  //   ctxList: [
  //     '8d8b9b39f5da4bc8c6c30c75b7941611_chunk',
  //     '4c0361057805fee5cd9aad40a21ecc54_chunk',
  //     '8f7fd196e3def92ffb43470e32ad0730_chunk',
  //     '9eb2c10e10af1ae17ff484bf0c71dece_chunk',
  //     'e2802fb41ebe047782ec5599da9eb494_chunk',
  //   ],
  // };
  const {
    ctxList, fileName, fileExtName, appkey, uploadType
  } = data;
  const chunkDirPath = await getSaveChunkDirPath(appkey, uploadType);
  const dirPath = await getMergeGroupDirPath(appkey, uploadType);
  const filePath = getFilePathWithDirAndNameAndExt(dirPath, fileName, fileExtName);
  const chunkFilePaths = ctxList.map((name) => ({
    name,
    filePath: path.resolve(chunkDirPath, name)
  }));
  const { length } = chunkFilePaths;
  // 创建写入流
  const ws = createWriteStream(filePath);
  console.log('-------- WriteStream 开始合并 --------');
  // 合并成功计数器
  let count = 0;
  // 合并文件流
  streamMergeRecursive(chunkFilePaths, ws, (type, d) => {
    if (type === 'end') count += 1;
    const status = count === length ? 'success' : 'combining';
    // TODO 接入真实redis缓存中，保存状态
    setRedisItem(getUploadCombineStatusKey(signature), type === 'error' ? 'fail' : status);
    console.log('type', type);
    console.log('data', d);
  });
}

// 获取合并状态的缓存key
export function getUploadCombineStatusKey(signature) {
  return `${signature}_merge_status`;
}
