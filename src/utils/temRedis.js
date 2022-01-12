// TODO 接入至redis 缓存的能力
const redisObj = {};

export const setRedisItem = (key, value) => {
  redisObj[key] = value;
};

export const getRedisItem = (key) => redisObj[key];

export const delRedisItem = (key) => delete redisObj[key];

export const getAllRedis = () => redisObj;
