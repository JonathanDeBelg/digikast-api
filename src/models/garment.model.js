const mongoose = require('mongoose');
const { clothingTypes, colourTypes, occasions} = require('../config/clothes');
const { toJSON } = require('./plugins');

const garmentSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    path: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: clothingTypes,
      required: true,
    },
    colour: {
      type: String,
      enum: colourTypes,
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
garmentSchema.plugin(toJSON);

/**
 * @typedef Garment
 */
const Garment = mongoose.model('Garment', garmentSchema);

module.exports = Garment;
