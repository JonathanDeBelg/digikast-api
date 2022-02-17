const httpStatus = require('http-status');
require('aws-sdk');
const ApiError = require('../utils/ApiError');
const { uploadFile, removeFile } = require('../utils/AWSFileUploader');
const { removeBackground } = require('../utils/BackgroundRemover');
const { Garment } = require('../models');

/**
 * Query for clothes
 * @param {Object} accountId - Mongo filter
 * @returns {Promise<QueryResult>}
 */
const queryClothes = async (closetId) => {
  const clothes = await Garment.find({
    closet: closetId,
  });
  return clothes;
};

/**
 * Query for all clothes
 * @returns {Promise<QueryResult>}
 */
const queryAllClothes = async () => {
  const clothes = await Garment.find({});
  return clothes;
};

/**
 * Get garment by id
 * @param {ObjectId} id
 * @returns {Promise<Closet>}
 */
const getGarmentById = async (id) => {
  return Garment.findById(id);
};

const createGarment = async (req, closet) => {
  const garment = await Garment.create({
    name: req.body.name,
    path: req.body.filePath,
    type: req.body.type,
    colour: req.body.colour,
    occasion: req.body.occasion,
    favorite: req.body.favorite,
    closet,
  });
  return garment;
};

const updateGarmentById = async (garmentId, updateRequest) => {
  const garment = await getGarmentById(garmentId);
  if (!garment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Garment not found');
  }

  if (await Garment.isNameDuplicate(updateRequest.name, garment.id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Name is duplicate');
  }
  Object.assign(garment, updateRequest);
  await garment.save();
  return garment;
};

const deleteGarmentById = async (req) => {
  const garment = await getGarmentById(req.params.garmentId);
  await removeFile(garment.path, req.user);

  Garment.findByIdAndDelete(req.params.garmentId, function (err) {
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
  return Garment.find({ type: garment.type });
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
  queryClothes,
  queryAllClothes,
  getGarmentById,
  createGarment,
  updateGarmentById,
  deleteGarmentById,
  changeCloset,
  getComparableItemsByGarmentId,
};
