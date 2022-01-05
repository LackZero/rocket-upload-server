// 模型定义，大写!!!!
// https://www.sequelize.com.cn/core-concepts/model-basics#%E6%A8%A1%E5%9E%8B%E5%AE%9A%E4%B9%89

import { DataTypes } from 'sequelize';
import { sequelize } from '../utils/sequelize';

// define() 方法接受三个参数
// 表名，表字段的定义和表的配置信息
// 与Apps_type 有所关联
const Apps = sequelize.define(
  'apps',
  {
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

      // 软删除也会检测唯一，所以将name+logicDeletedId 作为唯一一起使用
      unique: 'uniqueCompositeIndex'
    },
    // https://chsm1998.github.io/2020/08/29/logical-deletion-and-unique-index/
    logicDeletedId: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      unique: 'uniqueCompositeIndex'
    },
    secret: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    hooks: {
      beforeFind(options) {
        const { attributes } = options;
        // 排除 logicDeletedId 的获取
        if (!attributes) {
          // eslint-disable-next-line no-param-reassign
          options.attributes = { exclude: ['logicDeletedId'] };
        }
        if (attributes && !Array.isArray(attributes)) {
          const { exclude = [] } = attributes;
          attributes.exclude = [...exclude, 'logicDeletedId'];
        }
      },
      beforeDestroy: (model) => {
        // 将删除标识的删除状态设为id（推荐，使用主键确保不会发生索引冲突，并且实现简单）
        // eslint-disable-next-line no-param-reassign
        model.logicDeletedId = model.id;
      }
    }
  }
);

export default Apps;
