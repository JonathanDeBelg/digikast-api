const Joi = require('joi');

const create = {
  body: Joi.object().keys({
    name: Joi.string().optional().allow(''),
    type: Joi.string().required(),
    colour: Joi.string().required(),
    closetId: Joi.string().required(),
    filePath: Joi.string().required(),
  }),
};

module.exports = {
  create,
};
