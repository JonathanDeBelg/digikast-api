const mongoose = require('mongoose');
const { clothingTypes, colourTypes, occasions, closetItemTypes } = require('../../config/clothes');
const { toJSON } = require('../plugins');

const closetItemSchema = mongoose.Schema(
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
      required: false,
    },
    garmentType: {
      type: String,
      enum: clothingTypes,
      required: false,
    },
    closetItemType: {
      type: String,
      enum: closetItemTypes,
      required: false,
    },
    occasion: {
      type: String,
      enum: occasions,
      required: false,
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
 * @typedef ClosetItem
 */
const ClosetItem = mongoose.model('closet_items', closetItemSchema);

module.exports = ClosetItem;
