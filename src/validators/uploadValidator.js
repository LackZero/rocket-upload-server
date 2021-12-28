import Joi from 'joi';

/**
 * @desc 上传分片文件的校验器
 * @param {Object} data 用户数据
 */
export function uploadChunkValidator(data) {
  const schema = Joi.object({
    accessToken: Joi.string().required(),
    data: Joi.object({
      msgtype: Joi.string().required()
    })
      .unknown()
      .required()
  });
  return schema.validate(data);
}
