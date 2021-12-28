module.exports = {
  testEnvironment: 'node',
  moduleFileExtensions: ['js'], // 指定要测试的文件类型的后缀
  testMatch: ['<rootDir>/**/*.test.js'],
  testPathIgnorePatterns: ['/node_modules/', 'mysql.test.js']
};
