// dev 环境下的数据库连接配置
const mysqlConfig = {
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'rocket_assets',
  port: 3306,
  multipleStatements: true // 允许多条sql同时执行
};

export default mysqlConfig;
