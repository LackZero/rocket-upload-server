// https://www.sequelize.com.cn/core-concepts/model-basics#%E6%A8%A1%E5%9E%8B%E5%AE%9A%E4%B9%89

import { DataTypes } from 'sequelize';
import { sequelize } from '../utils/sequelize';
import Apps from './Apps';
// 存储 App 对应拥有的上传类型的表
const AppsType = sequelize.define(
  'apps_type',
  {
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
      unique: 'uniqueCompositeIndex'
    },
    logicDeletedId: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      unique: 'uniqueCompositeIndex'
    },
    uploadType: {
      type: DataTypes.STRING(45)
    }
  },
  {
    hooks: {
      // eslint-disable-next-line no-unused-vars
      beforeFind(options) {
        // console.log('AppsType options', options);
        // const { attributes } = options;
        // // 排除 logicDeletedId 的获取
        // if (!attributes) {
        //   // eslint-disable-next-line no-param-reassign
        //   options.attributes = { exclude: ['logicDeletedId'] };
        // }
        // if (attributes && !Array.isArray(attributes)) {
        //   const { exclude = [] } = attributes;
        //   attributes.exclude = [...exclude, 'logicDeletedId'];
        // }
        // console.log('options', options);
      },
      async beforeDestroy(model) {
        // 将删除标识的删除状态设为id（推荐，使用主键确保不会发生索引冲突，并且实现简单）
        await model.update({ logicDeletedId: model.id });
      },
      //  使用where 条件判断时 会触发下面批量删除赋值
      //  setterMethods 对deletedAt 字段无效，放弃挣扎了
      //  https://www.sequelize.com.cn/core-concepts/getters-setters-virtuals#%E8%AE%BE%E7%BD%AE%E5%99%A8
      beforeBulkDestroy: (options) => {
        // 触发单个 hook 删除
        // 可能会严重影响性能,具体取决于所涉及的记录数
        // eslint-disable-next-line no-param-reassign
        options.individualHooks = true;
      }
    }
  }
);

// 创建关联关系，查询Apps 带出 AppsType 关系
// 前关联关系相当于 Apps 为主表，AppsType 为关联表，
// foreignKey 就是 AppsType 表中关联 Apps 的字段(apps_id)。
Apps.hasMany(AppsType, {
  // 设定别名，在使用的时候也必须设定为相同的别名，否则仅通过将模型传递给 `include`,预先加载将不起作用:
  // 也可以model:"as(自定义的名字)"
  // 也影响着 方法名称 https://www.sequelize.com.cn/core-concepts/assocs#%E6%B3%A8%E6%84%8F-%E6%96%B9%E6%B3%95%E5%90%8D%E7%A7%B0
  as: 'appsType',
  // as: {
  //   // 指定单复数别名，方法也可以有单复数的形式
  //   // https://www.sequelize.com.cn/other-topics/naming-strategies#%E5%AE%9A%E4%B9%89%E5%88%AB%E5%90%8D%E6%97%B6%E8%A6%86%E7%9B%96%E5%8D%95%E6%95%B0%E5%92%8C%E5%A4%8D%E6%95%B0
  //   singular: 'appsType',
  //   plural: 'appsTypes'
  // },
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
