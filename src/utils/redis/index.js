/* eslint-disable class-methods-use-this */

import { createClient } from 'redis';

// redis 链接
class RedisConnect {
  // eslint-disable-next-line no-unused-vars
  constructor(opts = {}, customOptions = {}) {
    this.client = null;
    this._createClient(opts);
  }

  _createClient(options = {}) {
    const client = createClient(options);
    client.on('ready', this._onReady);
    client.on('end', this._onEnd);
    client.on('reconnecting', this._onReconnecting);
    client.on('error', this._onError);
    this.client = client;
  }

  _onReady() {
    console.log('Redis Client Reconnecting');
  }

  _onEnd() {
    console.log(
      'The client disconnected the connection to the server via .quit() or .disconnect()'
    );
  }

  _onReconnecting() {
    console.log('Redis Client Reconnecting');
  }

  _onError(err) {
    console.log('Redis Client Error\n', err);
  }
}

export default RedisConnect;
