import Joi from 'joi';
import config from '../../config';

export function addAppValidators(data) {
  const schema = Joi.object({
    name: Joi.string().required(),
    uploadType: Joi.string()
      .allow(...config.uploadType)
      .required()
  });
  return schema.validate(data);
}
