// https://www.sequelize.com.cn/core-concepts/model-basics#%E6%A8%A1%E5%9E%8B%E5%AE%9A%E4%B9%89

import { DataTypes } from 'sequelize';
import { sequelize } from '../utils/sequelize';

const AppsType = sequelize.define('apps_type', {
  id: {
    // Sequelize 库由 DataTypes 对象为字段定义类型
    type: DataTypes.INTEGER(11),
    // 允许为空
    allowNull: false,
    // 主键
    primaryKey: true,
    // 自增
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(45),
    allowNull: false,
    // 唯一
    unique: true
  },
  apps_id: {
    type: DataTypes.INTEGER(11),
    allowNull: false
  }
});

export default AppsType;
