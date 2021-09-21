const Joi = require('joi');

const create = {
  body: Joi.object().keys({
    name: Joi.string(),
    path: Joi.string().required(),
    type: Joi.string().required(),
    colour: Joi.string().required(),
    closetId: Joi.string().required(),
  }),
};

module.exports = {
  create,
};
