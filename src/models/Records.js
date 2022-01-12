import { DataTypes } from 'sequelize';
import { sequelize } from '../utils/sequelize';
import AppsType from './AppsType';

// 存储上传数据的表
const Records = sequelize.define(
  'records',
  {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    // 唯一性
    storageId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'uniqueCompositeIndex'
    },
    logicDeletedId: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      unique: 'uniqueCompositeIndex'
    },
    // 文件扩展名
    fileExtName: {
      type: DataTypes.STRING
    },
    // 元信息
    metaInfo: {
      type: DataTypes.STRING
    }
  },
  {
    hooks: {
      async beforeDestroy(model) {
        await model.update({ logicDeletedId: model.id });
      },
      beforeBulkDestroy: (options) => {
        // eslint-disable-next-line no-param-reassign
        options.individualHooks = true;
      }
    }
  }
);

// 创建关联关系，查询 AppsType 带出 Records 关系
// 前关联关系相当于 AppsType 为主表，Records 为关联表，
// foreignKey 就是 Records 表中关联 AppsType 的字段(uploadTypeId)。
AppsType.hasMany(Records, {
  as: 'records',
  foreignKey: 'appsTypeId', // 外键名,
  sourceKey: 'id' // 目标健
});

// 反向一对一相当于还是以 AppsType 为主表，只不过是通过 Records 反向查询。
// Records 属于 Apps
Records.belongsTo(AppsType, {
  as: 'appsType', // 使用别名（可代替目标模型）,
  foreignKey: 'appsTypeId', // 外键名,
  targetKey: 'id' // 目标健，默认主键
});

export default Records;
