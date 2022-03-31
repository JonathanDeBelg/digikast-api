const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const Closet = require('../models/clothing/closet.model');
require('../models/account.model');
const { clothingService } = require('../services');
const { uploadFile } = require("../utils/AWSFileUploader");

const getClothes = catchAsync(async (req, res) => {
  const result = await clothingService.queryClothesByCloset(req.params.closet);
  res.send(result);
});

const getAllClothes = catchAsync(async (req, res) => {
  const result = await clothingService.queryAllClothes();
  res.send(result);
});

const getGarment = catchAsync(async (req, res) => {
  const garment = await clothingService.getGarmentById(req.params.garmentId);
  if (!garment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Garment not found');
  }
  res.send(garment);
});

const getGarmentSet = catchAsync(async (req, res) => {
  const result = await clothingService.queryGarmentSetsByCloset(req.params.closet);
  res.send(result);
});

const getComperableGarments = catchAsync(async (req, res) => {
  const garments = await clothingService.getComparableItemsByGarmentId(req.params.garment);
  res.send(garments);
});

const createGarment = catchAsync(async (req, res) => {
  const filePath = await uploadFile(req.file, req);
  const closet = await Closet.findById(req.body.closetId);
  if (closet == null) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Closet doesn't exist yet");
  }
  const garment = await clothingService.createGarment(req, closet, filePath);
  res.status(httpStatus.CREATED).send(garment);
});

const createGarmentSet = catchAsync(async (req, res) => {
  const closet = await Closet.findById(req.body.closetId);
  const garment = await clothingService.createGarmentSet(req, closet);
  res.status(httpStatus.CREATED).send(garment);
});

const updateGarment = catchAsync(async (req, res) => {
  const garment = await clothingService.updateGarmentById(req.params.garmentId, req.body);
  res.status(httpStatus.OK).send(garment);
});

const deleteGarment = catchAsync(async (req, res) => {
  await clothingService.deleteGarmentById(req);
  res.status(httpStatus.OK).send('Succesfull deletion');
});

module.exports = {
  getClothes,
  getAllClothes,
  getGarment,
  getGarmentSet,
  getComperableGarments,
  createGarment,
  updateGarment,
  deleteGarment,
  createGarmentSet,
};
