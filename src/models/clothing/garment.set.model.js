const mongoose = require('mongoose');
const { toJSON } = require('../plugins');

const closetItemSchema = mongoose.Schema(
  {
    setId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
    },
    name: {
      type: String,
      trim: true,
    },
    closetItem: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'closet_items',
      required: true,
    },
    closet: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Closet',
      required: true,
    },
    account: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Account',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
closetItemSchema.plugin(toJSON);

/**
 * @typedef GarmentSet
 */
const GarmentSet = mongoose.model('garment_sets', closetItemSchema);

module.exports = GarmentSet;
