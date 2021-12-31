// 生成配置文件

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const configPath = path.join(__dirname, '../config/config.yaml');
const config = yaml.load(fs.readFileSync(configPath));

// 复制文件到指定目录
const copy = (src, dist) => {
  fs.createReadStream(src).pipe(fs.createWriteStream(dist));
};

// 写入文件到指定目录
const writeTmpFile = (filepath, content) => {
  fs.writeFileSync(path.resolve(__dirname, filepath), content, {
    encoding: 'utf8'
  });
};

const envs = ['dev', 'prod'];

// 复制pm2 配置文件至根目录
function copyPm2Config(env) {
  const src = path.resolve(__dirname, `../config/pm2-config/ecosystem.config_${env}.js`);
  const dist = path.resolve(__dirname, '../ecosystem.config.js');
  copy(src, dist);
  console.log('pm2配置文件复制成功,请至 %s 进行查看', dist);
}

// 写入配置文件
function writeConfig(env) {
  const configContent = `
import path from 'path';
import databaseConfig from './database-config/database.${env}';
const data = ${JSON.stringify(config, null, '\t')};
const port = process.env.NODE_PORT || data.port;
const env = process.env.NODE_ENV || 'dev';
const assetsPath = env === 'dev' ? path.resolve(__dirname, '../assets') : data.assetsPath[env];
const config = { ...data, port, env, database: databaseConfig, assetsPath };
export default config;
  `;
  const dist = path.resolve(__dirname, '../config/index.js');
  writeTmpFile(dist, configContent);
  console.log('config配置文件写入成功，请至 %s 进行查看', dist);
}

async function main() {
  const args = process.argv;
  const env = args[3];
  console.log('当前构建环境：', env);
  if (envs.includes(env)) {
    copyPm2Config(env);
    writeConfig(env);
  } else {
    const envsText = envs.join('|');
    console.log(`【generateConfig】params error: please use npm run gen -- -e ${envsText}\n`);
    process.exit(-1);
  }
}

main();
