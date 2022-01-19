import commands from 'redis-commands';
import RedisConnect from './index';

class RedisUtils {
  constructor(options) {
    this.client = null;
    this.proxy = null;

    this._init(options);
  }

  /**
   *@desc redis utils 单例
   * @param options 连接redis的配置
   * @returns {RedisUtils}
   */
  static getInstance(options) {
    if (!this.instance) {
      this.instance = new RedisUtils(options);
    }
    return this.instance;
  }

  _init(options) {
    const redis = new RedisConnect(options);
    this.client = redis.client;
    // 设定代理
    this.proxy = this._createMethodProxy();
  }

  _createMethodProxy() {
    const handlers = {
      get: (target, property) => {
        if (Reflect.has(target, property)) {
          return target[property];
        }
        // 检测是否是redis自带命令
        if (commands.exists(property)) {
          return async (...args) => target.client[property](...args);
        }

        // 如果想要使用redis的subscribe功能，这里可以不报错，直接走代理target.client[property]
        // 暂时不放开
        throw new Error(`暂时没有该 Method Property: ${property}`);
      }
    };

    // 设定this代理，扩展this.client功能
    return new Proxy(this, handlers);
  }

  // 扩展的方法
  async getJson(key) {
    const res = JSON.parse(await this.client.get(key));
    return res;
  }

  async setJson(key, value) {
    const str = JSON.stringify(value);
    const res = await this.client.set(key, str);
    return res;
  }
}

const redis = RedisUtils.getInstance({}).proxy;

// redis.getJson();
// 只对外暴露一个接口
export default redis;
