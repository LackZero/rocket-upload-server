// 存放工具类函数

// 延迟 time ms
// eslint-disable-next-line no-promise-executor-return
export const delay = (time = 3000) => new Promise((resolve) => setTimeout(resolve, time));
