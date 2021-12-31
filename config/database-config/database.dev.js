// dev 环境下的数据库连接配置
const databaseConfig = {
  // 使用哪个数据库程序
  dialect: 'mysql',
  database: 'rocket_test',
  username: 'root',
  password: '12345678',
  host: 'localhost',
  port: 3306,
  // 连接池
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  // 数据表相关的全局配置
  define: {
    // 是否冻结表名，停止 Sequelize 执行自动复数化. 这样,Sequelize 将推断表名称等于模型名称,而无需进行任何修改
    // 默认情况下，表名会转换为复数形式
    freezeTableName: true,
    // 是否为表添加 createdAt 和 updatedAt 字段
    // createdAt 记录表的创建时间
    // updatedAt 记录字段更新时间
    timestamps: true,
    // 是否为表添加 deletedAt 字段
    // 默认情况下, destroy() 方法会删除数据，
    // 设置 paranoid 为 true 时，将会更新 deletedAt 字段，并不会真实删除数据。
    paranoid: true,
    // 为 createdAt,updatedAt,deletedAt 列指定自定义名称
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  }
};

export default databaseConfig;
