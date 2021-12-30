// 存放工具类函数

// 延迟 time ms
// eslint-disable-next-line no-promise-executor-return
export const delay = (time = 3000) => new Promise((resolve) => setTimeout(resolve, time));

/**
 * @desc 检测是否是空对象
 * @param obj
 * @returns {boolean}
 */
export function checkNullObj(obj) {
  return Object.keys(obj).length === 0;
}
