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
