const mongoose = require('mongoose');
const { accountTypes } = require('../config/account');
const { toJSON } = require('./plugins');

const accountSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
      trim: true,
    },
    type: {
      type: String,
      enum: accountTypes,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
accountSchema.plugin(toJSON);

/**
 * @typedef Account
 */
const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
