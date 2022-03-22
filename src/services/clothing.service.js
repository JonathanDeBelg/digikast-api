const httpStatus = require('http-status');
require('aws-sdk');
const mongoose = require('mongoose');
const ApiError = require('../utils/ApiError');
const { ClosetItem, GarmentSet } = require('../models');
const { removeFile } = require('../utils/AWSFileUploader');
const {clothingTypes, closetItemTypes} = require("../config/clothes");

/**
 * Query for clothes
 * @returns {Promise<QueryResult>}
 * @param closetId
 */
const queryClothesByCloset = async (closetId) => {
  const clothes = await ClosetItem.find({
    closet: closetId,
  });
  return clothes;
};

/**
 * Query for garment-sets
 * @returns {Promise<QueryResult>}
 * @param closetId
 */
const queryGarmentSetsByCloset = async (closetId) => {
  const garmentSet = await GarmentSet.find({
    closet: closetId,
  });
  return garmentSet;
};

/**
 * Query for all clothes
 * @returns {Promise<QueryResult>}
 */
const queryAllClothes = async () => {
  const clothes = await ClosetItem.find({});
  return clothes;
};

/**
 * Get garment by id
 * @param {ObjectId} id
 * @returns {Promise<Closet>}
 */
const getGarmentById = async (id) => {
  return ClosetItem.findById(id);
};

/**
 * Get garment by id
 * @param {ObjectId} id
 * @returns {Promise<Closet>}
 */
const getGarmentSetById = async (id) => {
  return GarmentSet.findById(id);
};

const createGarmentSet = async (req, closet) => {
  const setId = new mongoose.Types.ObjectId();
  await Promise.all(
    req.body.items.map((item) => {
      return GarmentSet.create({
        setId,
        closetItem: item,
        closet,
      });
    })
  );

  return setId;
};

const createGarment = async (req, closet, filePath) => {
  let closetItem;
  if (req.body.closetItemTyp === closetItemTypes.GARMENT) {
    closetItem = await ClosetItem.create({
      name: req.body.name,
      path: filePath.Location,
      garmentType: req.body.garmentType,
      closetItemType: req.body.closetItemType,
      colour: req.body.colour,
      occasion: req.body.occasion,
      favorite: req.body.favorite,
      closet,
    });
  } else {
    closetItem = await ClosetItem.create({
      name: req.body.name,
      path: req.body.filePath,
      closetItemType: req.body.closetItemType,
      occasion: req.body.occasion,
      favorite: req.body.favorite,
      closet,
    });
  }

  return closetItem;
};

const updateGarmentById = async (garmentId, updateRequest) => {
  const garment = await getGarmentById(garmentId);
  if (!garment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Garment not found');
  }

  if (await ClosetItem.isNameDuplicate(updateRequest.name, garment.id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Name is duplicate');
  }
  Object.assign(garment, updateRequest);
  await garment.save();
  return garment;
};

const deleteGarmentById = async (req) => {
  const garment = await getGarmentById(req.params.garmentId);
  await removeFile(garment.path, req.user);

  ClosetItem.findByIdAndDelete(req.params.garmentId, function (err) {
    if (err) throw new ApiError(httpStatus.NOT_FOUND, err);
  });
};

const changeCloset = async (closet, garmentId) => {
  const garment = await getGarmentById(garmentId);
  if (!garment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Garment not found');
  }
  garment.closet = closet;
  await garment.save();
  return garment;
};

const getComparableItemsByGarment = async (garment) => {
  return ClosetItem.find({ type: garment.type });
};

const getComparableItemsByGarmentId = async (garmentId) => {
  const garment = await getGarmentById(garmentId);
  if (!garment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Garment not found');
  }
  const comparableGarments = await getComparableItemsByGarment(garment);
  return comparableGarments;
};

module.exports = {
  queryClothesByCloset,
  queryGarmentSetsByCloset,
  queryAllClothes,
  getGarmentById,
  createGarment,
  updateGarmentById,
  deleteGarmentById,
  changeCloset,
  getComparableItemsByGarmentId,
  createGarmentSet,
};
