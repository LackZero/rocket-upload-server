// https://www.sequelize.com.cn/core-concepts/model-basics#%E6%A8%A1%E5%9E%8B%E5%AE%9A%E4%B9%89

import { DataTypes } from 'sequelize';
import { sequelize } from '../utils/sequelize';
import Apps from './Apps';

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
  // 临时测试 underscored 是否生效，TODO 后续移除
  camelCase: {
    type: DataTypes.STRING(45)
  }
  // apps_id: {
  //   type: DataTypes.INTEGER(11),
  //   allowNull: false
  // }
});

// 创建关联关系，查询Apps 带出 AppsType 关系
// 前关联关系相当于 Apps 为主表，AppsType 为关联表，
// foreignKey 就是 AppsType 表中关联 Apps 的字段(apps_id)。
Apps.hasMany(AppsType, {
  // 设定别名，在使用的时候也必须设定为相同的别名，否则仅通过将模型传递给 `include`,预先加载将不起作用:
  // 也可以model:"as(自定义的名字)"
  // 也影响着 方法名称 https://www.sequelize.com.cn/core-concepts/assocs#%E6%B3%A8%E6%84%8F-%E6%96%B9%E6%B3%95%E5%90%8D%E7%A7%B0
  as: 'appsType',
  foreignKey: 'appsId', // 外键名,
  sourceKey: 'id' // 目标健
});

// 反向一对一相当于还是以 Apps 为主表，只不过是通过 AppsType 反向查询。
// AppsType 属于 Apps
AppsType.belongsTo(Apps, {
  as: 'app', // 使用别名（可代替目标模型）,
  foreignKey: 'appsId', // 外键名,
  targetKey: 'id' // 目标健，默认主键
});

export default AppsType;
