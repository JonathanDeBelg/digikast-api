const Joi = require('joi');

const create = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    type: Joi.bool().required(),
    id: Joi.optional().allow('')
  }),
};

module.exports = {
  create,
};
