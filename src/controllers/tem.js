import response from '../utils/response';
import redis from '../utils/redis/redisUtils';

export async function handleGetAllRedisData(ctx) {
  const { params } = ctx.request.body;
  const data = await redis.scan(params);
  response.success(ctx, data);
}

export async function handleGetRedisDataByKey(ctx) {
  const { key } = ctx.request.body;
  const data1 = await redis.getJson(key);
  const data2 = await redis.get(`${key}_cus`);
  response.success(ctx, { data1, data2 });
}

export async function handleSetRedisDataByKey(ctx) {
  const { key, data } = ctx.request.body;
  const res1 = await redis.setJson(key, data);
  const res2 = await redis.set(`${key}_cus`, JSON.stringify(data));
  response.success(ctx, { res1, res2 });
}
