import Joi from 'joi';

/**
 * @desc 上传分片文件的校验器
 * @param {Object} data 用户数据
 */
export function uploadCombineChunkValidator(data) {
  const schema = Joi.object({
    uid: Joi.number(),
    appkey: Joi.string().required(),
    uploadType: Joi.string().required(),
    fileSize: Joi.number().required(),
    fileExtName: Joi.string(),
    fileName: Joi.string().required(),
    deviceType: Joi.string().required(),
    clientIp: Joi.string().allow(''),
    ctxList: Joi.array().required()
  });
  return schema.validate(data);
}
