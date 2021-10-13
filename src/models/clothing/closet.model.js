const mongoose = require('mongoose');
const { toJSON } = require('../plugins');

const closetSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: false,
    },
    account: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
    },
    type: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
closetSchema.plugin(toJSON);

/**
 * Check if name is duplicate
 * @param {string} name - The closets's name
 * @param {ObjectId} [excludeClosetId] - The id of the closet to be excluded
 * @returns {Promise<boolean>}
 */
closetSchema.statics.isNameDuplicate = async function (name, excludeClosetId) {
  console.log(excludeClosetId);
  const closet = await this.findOne({ name, _id: { $ne: excludeClosetId } });
  return !!closet;
};

/**
 * @typedef Closet
 */
const Closet = mongoose.model('Closet', closetSchema);

module.exports = Closet;
