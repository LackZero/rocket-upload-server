import { encodeAppKeyToSecret } from '../utils/cryptoUtils';
import config from '../../config';
import Apps from '../models/Apps';
import AppsType from '../models/AppsType';
import { sequelize } from '../utils/sequelize';

// 获取所有app信息
export async function getAllAppsService() {
  const result = await Apps.findAll({ include: 'appsType' });
  // 两种调用方式都可以
  // const result = await Apps.findAll({ include: { model: AppsType, as: 'appsType' } });
  const result1 = await AppsType.findAll({
    include: {
      model: Apps,
      as: 'app',
      // app:{} 不展示属性，
      attributes: []
    },
    // 扁平化数据
    attributes: {
      include: [[sequelize.col('app.name'), 'appName']]
    }
  });
  console.log('result', result);
  return { result, result1 };
}
// 增加 新APP and UploadType
export async function addNewAppsService(params) {
  const { name, uploadTypes = [] } = params;
  const { cipherText } = encodeAppKeyToSecret(name, config.uploadAppSecretKey);
  const result = await Apps.create({ name, secret: cipherText });
  // debugger;
  console.log('result', result);
  const uploadTypeData = uploadTypes.map((uploadType) => ({
    name: `${name}${uploadType}`,
    camelCase: uploadType
  }));
  // https://stackoverflow.com/questions/59361200/bulk-insertion-in-sequelize-hasmany-association
  // 先 bulkCreate 在AppsType表中批量创建数据
  const appsTypesModels = await AppsType.bulkCreate(uploadTypeData);
  // 注意方法名称：https://www.sequelize.com.cn/core-concepts/assocs#%E6%B3%A8%E6%84%8F-%E6%96%B9%E6%B3%95%E5%90%8D%E7%A7%B0
  // 在增加与Apps表的关联性
  await result.addAppsType(appsTypesModels);
  // 使用关联性，所以注释下面的函数
  // await AppsType.create({ name: uploadTypeName, apps_id: result.id });
  return { id: result.id };
}

// 获取app信息
export async function getAppInfoByIdService(id) {
  const result = await Apps.findOne({ where: { id }, include: 'appsType' });
  return result;
}
