// 模型定义，大写!!!!
// https://www.sequelize.com.cn/core-concepts/model-basics#%E6%A8%A1%E5%9E%8B%E5%AE%9A%E4%B9%89

import { DataTypes } from 'sequelize';
import { sequelize } from '../utils/sequelize';

// define() 方法接受三个参数
// 表名，表字段的定义和表的配置信息
// 与Apps_type 有所关联
const Apps = sequelize.define('apps', {
  id: {
    // Sequelize 库由 DataTypes 对象为字段定义类型
    type: DataTypes.INTEGER(11),
    // 允许为空
    allowNull: false,
    // 主键，primary key=unique+not null
    primaryKey: true,
    // 自增
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(45),
    allowNull: false,
    // 唯一,在这种情况下,与验证不同,它执行了 SQL 查询
    // mysql 中unique除了在插入重复数据的时候会报错，还会使auto_increment自动增长
    // https://stackoverflow.com/questions/10108593/mysql-autoincrement-value-increases-even-when-insertion-fails-due-to-error
    // https://www.cnblogs.com/hongdada/p/9970176.html#unique%E4%B8%8Eprimary-key%E7%9A%84%E5%8C%BA%E5%88%AB
    unique: true
  },
  secret: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

export default Apps;
