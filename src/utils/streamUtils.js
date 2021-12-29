/* eslint-disable node/no-callback-literal */

import { createReadStream } from 'fs';

/**
 * @desc 多个文件通过Stream合并为一个文件
 * 设置可读流的 end 为 false 可保持写入流一直处于打开状态。
 * 如何将多个文件通过 Stream 合并为一个文件，也是通过这种方式，一开始可写流处于打开状态，
 * 直到所有的可读流结束，再将可写流给关闭。
 * @param {object[]} fileList
 * @param {string} fileList.filePath 待合并的文件路径
 * @param {WriteStream} fileWriteStream 可写入文件的流
 * @param {func} [callback] 回调函数
 * @returns {*}
 */
export function streamMergeRecursive(fileList, fileWriteStream, callback) {
  if (!fileList.length) {
    console.log('-------- WriteStream 合并完成 --------');
    // 最后关闭可写流，防止内存泄漏
    // 关闭流之前立即写入最后一个额外的数据块(Stream 合并完成)。
    fileWriteStream.end('---Stream 合并完成---');
    return;
  }
  const data = fileList.shift();
  const { filePath: chunkFilePath } = data;
  console.log('-------- 开始合并 --------\n', chunkFilePath);
  callback && callback('start', data);
  // 获取当前的可读流
  const currentReadStream = createReadStream(chunkFilePath);
  // 监听currentReadStream的on('data'),将读取到的内容调用fileWriteStream.write方法
  // end:true 读取结束时终止写入流,设置 end 为 false 写入的目标流(fileWriteStream)将会一直处于打开状态
  currentReadStream.pipe(fileWriteStream, { end: false });
  // 监听可读流的 end 事件，结束之后递归合并下一个文件 或者 手动调用可写流的 end 事件
  currentReadStream.on('end', () => {
    console.log('-------- 结束合并 --------\n', chunkFilePath);
    callback && callback('end', data);
    streamMergeRecursive(fileList, fileWriteStream, callback);
  });

  // 监听错误事件，关闭可写流，防止内存泄漏
  currentReadStream.on('error', (error) => {
    console.log('-------- WriteStream 合并失败 --------');
    console.error(`SaveFileError: 当前文件${chunkFilePath}读取错误\n`, error);
    callback && callback('error', data);
    fileWriteStream.close();
  });
}
