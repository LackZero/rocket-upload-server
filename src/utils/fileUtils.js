import { execSync } from 'child_process';
import config from '../../config';

export const clearFiles = (dir, name, day = 7) => {
  console.log(`正在删除本地磁盘数据 \ndir: ${dir} \nname: ${name} \nday: ${day}`);
  try {
    const result = execSync(`find ${dir} -mtime +${day} -type f -name '${name}'| xargs rm -rf`);
    // console.log('result', result, result.toString());
    return { msg: `已清除 ${day} 天前的数据 ${result}` };
  } catch (e) {
    const msg = `清除失败 ${e.message}`;
    throw new Error(msg);
  }
};

export const clearScreenshotFiles = (day) => clearFiles(config.assetsPath, '*.png', day);
