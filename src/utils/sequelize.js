// models 目录用于存放 Sequelize 库相关文件，
// 下层目录对应 Sequelize 打开 Mysql 中的 Database，
// 每个下层目录中的 index.js
// 主文件用于整合 Model，而其他 .js 文件对应当前 Database 中的一张 Table。

// 导入配置文件，并实例化 Sequelize。
import { Sequelize } from 'sequelize';
import config from '../../config';
// 实例化，并指定配置
export const sequelize = new Sequelize(config.database);

// 测试连接
// sequelize
//   .authenticate()
//   .then(() => {
//     console.log('Connection has been established successfully.');
//   })
//   .catch((err) => {
//     console.error('Unable to connect to the database:', err);
//   });
