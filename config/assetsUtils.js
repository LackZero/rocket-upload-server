import path from 'path';
import config from './index';

// 获取 group 文件的绝对位置
export const getGroupAbsolutePath = () => path.resolve(config.assetsPath, config.groupRelativePath);
