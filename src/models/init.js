// 导入
import { readdirSync } from 'fs';
import path from 'path';
import { sequelize } from '../utils/sequelize';

// 同步到 Mysql 中
// 参考 https://www.sequelize.com.cn/core-concepts/model-basics#%E6%A8%A1%E5%9E%8B%E5%90%8C%E6%AD%A5
// 也就是将我们用 js 对象声明的模型通过 sequelize 转换成 mysql 中真正的一张数据表
//  Sequelize 库会为我们执行以下 Mysql 原生命令在 test 中创建一张名为 user 的数据表。
// eslint-disable-next-line max-len
// CREATE TABLE IF NOT EXISTS `test_user` (`id` INTEGER NOT NULL auto_increment , `name` TEXT, `favorite_color` TEXT, `age` INTEGER, `cash` INTEGER, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, `deletedAt` DATETIME, PRIMARY KEY (`id`)) ENGINE=InnoDB
(async function init() {
  // 不参与初始化sql的文件
  const filterFiles = ['init.js', 'init.sql'];
  const syncFiles = readdirSync(__dirname)
    // 暂时没过滤是否是文件夹，可参考 https://quickapp.lovejade.cn/nodejs-how-to-get-all-files-in-a-dir-sync/
    .filter((name) => !filterFiles.includes(name))
    .map((name) => path.resolve(__dirname, name))
    // 加载文件
    .map(require);
  console.log('syncFiles', syncFiles);
  // 标准同步
  // 只有当数据库中不存在与模型同名的数据表时，才会同步
  await sequelize.sync();
  // 动态同步
  // 修改同名数据表结构，以适用模型。
  // await sequelize.sync({ alter: true });
  // 强制同步
  // 删除同名数据表后同步，谨慎使用，会导致数据丢失
  // await sequelize.sync({ force: true });
  // 另外，当你指定表与表之间的关联后，修改被关联的表结构时会抛出异常。
  // 需要先注释掉关联代码，然后更新同步模型后，再取消掉注释即可。
  // 再另外，当你有新的关联时必须使用动态同步才会生效。
})();

// sequelize.sync();
