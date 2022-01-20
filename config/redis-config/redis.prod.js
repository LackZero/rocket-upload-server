// prod 环境下的redis 配置
// https://github.com/redis/node-redis/blob/master/docs/client-configuration.md
const redisConfig = {
  // redis[s]://[[username][:password]@][host][:port][/db-number]
  url: 'redis://local@127.0.0.1:6379/0'
};

export default redisConfig;
