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
  const result = await Apps.create({
    name,
    secret: name === 'aicenter' ? '6c04b5180a099119' : cipherText
  });
  // debugger;
  // console.log('result', result);
  const uploadTypeData = uploadTypes.map((uploadType) => ({
    name: `${name}${uploadType}`,
    uploadType,
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

// 编辑app信息
export async function editAppInfoService(params) {
  const { id, name, uploadTypes = [] } = params;
  const { name: originName, appsType } = await getAppInfoByIdService(id);
  // name 是否修改
  const isNameModify = name !== originName;
  // 更改了上传类型
  if (uploadTypes.length) {
    const delIds = [];
    const updateData = [];
    const usedTypes = [];
    appsType.forEach((item) => {
      const { uploadType, id } = item;
      // 不包含则删除
      if (!uploadTypes.includes(uploadType)) {
        delIds.push(id);
      } else {
        usedTypes.push(uploadType);
        // 包含则看名字是否需要修改
        // eslint-disable-next-line no-lonely-if
        if (isNameModify) {
          updateData.push({ id, name: `${name}${uploadType}` });
        }
      }
    });
    // 过滤出没有使用过的type，用来新增数据
    const createData = uploadTypes
      .filter((type) => !usedTypes.includes(type))
      .map((uploadType) => ({
        appsId: id,
        name: `${name}${uploadType}`,
        uploadType
      }));
    console.log('delIds', delIds);
    await Promise.all([
      // 批量删除,
      // 因为 unique index: 如果表有唯一索引, 比如用户表的邮箱列有唯一索引,
      // 那么在做了软删除后被删除行的邮箱从数据角度任然在起作用, 所以不能创建相同邮箱的用户.
      AppsType.destroy({ where: { id: delIds } }),
      // 批量更新，updateOnDuplicate 如果重复，更新指定字段，updateOnDuplicate
      AppsType.bulkCreate(updateData, { updateOnDuplicate: ['name', 'updatedAt'] }),
      // 批量增加
      AppsType.bulkCreate(createData)
    ]);
  }

  if (isNameModify) {
    await Apps.update({ name }, { where: { id } });
  }

  return true;
}

// 删除app
export async function delAppByIdService(id) {
  // 获取实例
  const app = await Apps.findByPk(id);
  if (!app) throw new Error('删除失败，请传入有效的Id');
  await app.destroy();
  // 下面的逻辑已移步至hooks中
  // console.log('app', app, id);
  // 获取关联的实例
  // const appTypes = await app.getAppsType();
  // // 开始删除
  // const calls = [app.destroy()];
  // appTypes.forEach((model) => {
  //   calls.push(model.destroy());
  // });
  // // console.log('appTypes', appTypes);
  //
  // const result = await Promise.all(calls);
  // console.log('result', result);

  // const result = await Apps.destroy({ where: { id } });
  // console.log('result', result);
  return true;
}
