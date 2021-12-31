import { encodeAppKeyToSecret } from '../utils/cryptoUtils';
import Apps from '../models/Apps';
import config from '../../config';
import AppsType from '../models/AppsType';

// 增加 新APP and UploadType
export async function addNewAppsService(params) {
  const { name, uploadType } = params;
  const { cipherText } = encodeAppKeyToSecret(name, config.uploadAppSecretKey);
  const uploadTypeName = `${name}${uploadType}`;
  const result = await Apps.create({ name, secret: cipherText });
  await AppsType.create({ name: uploadTypeName, apps_id: result.id });
  return { id: result.id };
}
