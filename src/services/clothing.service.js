const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
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

const createGarment = async (garmentBody, closet) => {
  const garment = await Garment.create({
    name: garmentBody.name,
    path: garmentBody.path,
    type: garmentBody.type,
    colour: garmentBody.colour,
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

const deleteGarmentById = async (garmentId) => {
  const garment = await getClosetById(garmentId);
  if (!garment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Garment not found');
  }

  await garment.remove();
  return garment;
};

const changeCloset = async (closet, garmentId) => {
  const garment = await getGarmentById(garmentId);
  if (!garment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Garment not found');
  }
  garment['closet'] = closet;
  await garment.save();
  return garment;
};

module.exports = {
  queryClothes,
  queryAllClothes,
  getGarmentById,
  createGarment,
  updateGarmentById,
  deleteGarmentById,
  changeCloset,
};
