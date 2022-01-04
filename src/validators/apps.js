import Joi from 'joi';
import config from '../../config';

export function addAppValidators(data) {
  const schema = Joi.object({
    name: Joi.string().required(),
    uploadTypes: Joi.array()
      .items(Joi.string().valid(...config.uploadType))
      .required()
  });
  return schema.validate(data);
}

export function editAppValidators(data) {
  const schema = Joi.object({
    id: Joi.number().required(),
    name: Joi.string(),
    // 如果不传则不做更改，传过之后则批量修改
    uploadTypes: Joi.array()
      .items(Joi.string().valid(...config.uploadType))
      .required()
  });
  return schema.validate(data);
}
