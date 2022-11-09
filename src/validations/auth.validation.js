const Joi = require('joi');
const { password } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      'string.base': `Veld "email" moet tekst bevatten.`,
      'string.empty': `Veld "email" mag niet leeg zijn.`,
      'string.email': `Veld "email" moet een emailadres zijn.`,
      'any.required': `Veld "email" is verplicht.`,
    }),
    password: Joi.string().required().custom(password).messages({
      'string.base': `Veld "wachtwoord" moet tekst bevatten.`,
      'string.empty': `Veld "wachtwoord" mag niet leeg zijn.`,
      'any.required': `Veld "wachtwoord" is verplicht.`,
    }),
    name: Joi.string().required().messages({
      'string.base': `Veld "voornaam" moet tekst bevatten.`,
      'string.empty': `Veld "voornaam" mag niet leeg zijn.`,
      'any.required': `Veld "voornaam" is verplicht.`,
    }),
    deviceId: Joi.string().required(),
    gender: Joi.string().optional().allow(''),
    age: Joi.number().optional().allow('').messages({
      'number.base': `Veld "leeftijd" moet nummers bevatten.`,
    }),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

const registerDevice = {
  body: Joi.object().keys({
    deviceId: Joi.string().required(),
    account: Joi.string().required(),
  }),
};

const loginDevice = {
  body: Joi.object().keys({
    deviceId: Joi.string().required(),
  }),
};

const removeDevice = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
  }),
};

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
  removeDevice,
  registerDevice,
  loginDevice,
};
