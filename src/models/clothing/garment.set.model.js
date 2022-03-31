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
      ref: 'Closet-items',
      required: true,
    },
    closet: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Closet',
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
const GarmentSet = mongoose.model('Garment-set', closetItemSchema);

module.exports = GarmentSet;
