import Joi from 'joi';
import config from '../../config';

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
    fileExtName: Joi.string()
      .when('uploadType', {
        is: Joi.string().pattern(/.Image/),
        then: Joi.valid(...config.imageExtnameValida)
      })
      .when('uploadType', {
        is: Joi.string().pattern(/.Video/),
        // 空则校验是否是string
        then: Joi.valid(...config.videoExtnameValida)
      })
      .when('uploadType', {
        is: Joi.string().pattern(/.Audio/),
        then: Joi.valid(...config.audioExtnameValida)
      })
      .when('uploadType', {
        is: Joi.string().pattern(/.Document/),
        then: Joi.valid(...config.documentExtnameValida)
      }),
    fileName: Joi.string().required(),
    deviceType: Joi.string().required(),
    clientIp: Joi.string().allow(''),
    ctxList: Joi.array().min(1).required()
  });
  return schema.validate(data);
}
