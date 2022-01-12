import response from '../utils/response';
import { getAllRedis } from '../utils/temRedis';

export async function handleGetAllRedisData(ctx) {
  response.success(ctx, getAllRedis());
}
