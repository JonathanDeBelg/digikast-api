const mongoose = require('mongoose');
const { clothingTypes, colourTypes, occasions } = require('../../config/clothes');
const { toJSON } = require('../plugins');

const clothesSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
      index: true,
    },
    path: {
      type: String,
      required: true,
    },
    colour: {
      type: String,
      enum: colourTypes,
      required: true,
    },
    type: {
      type: String,
      enum: clothingTypes,
      required: true,
    },
    occasion: {
      type: String,
      enum: occasions,
      required: true,
    },
    favorite: {
      type: Boolean,
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
clothesSchema.plugin(toJSON);

/**
 * @typedef Clothes
 */
const Clothes = mongoose.model('Clothes', clothesSchema);

module.exports = Clothes;
