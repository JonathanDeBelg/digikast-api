const Joi = require('joi');

const create = {
  body: Joi.object().keys({
    name: Joi.string().optional().allow(''),
    closetId: Joi.string().required(),
    occasion: Joi.string().optional(),
    favorite: Joi.bool().required(),
    closetItemType: Joi.string().required(),
    garmentType: Joi.string().optional(),
    colour: Joi.string().optional(),
  }),
};

const createGarmentSet = {
  body: Joi.object().keys({
    name: Joi.string().optional().allow(''),
    closetId: Joi.string().required(),
    items: Joi.any().required(),
    occasion: Joi.string().required(),
    favorite: Joi.bool().required(),
  }),
};

module.exports = {
  create,
  createGarmentSet,
};
