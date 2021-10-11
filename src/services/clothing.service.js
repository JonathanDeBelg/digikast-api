const ApiError = require("../utils/ApiError");
const uploadFile = require("../utils/AWSFileUploader");
const httpStatus = require("http-status");
const { Garment } = require('../models');
const AWS = require("aws-sdk")

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
  var filePath = await uploadFile(req);

  const garment = await Garment.create({
    name: req.body.name,
    path: filePath.Location,
    type: req.body.type,
    colour: req.body.colour,
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
  console.log(await queryAllClothes());
  Garment.findByIdAndDelete(garmentId, function (err) {
    if(err) throw new ApiError(httpStatus.NOT_FOUND, err);
    console.log("Successful deletion");
  });
  return;
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
