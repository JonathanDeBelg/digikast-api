const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const Closet = require('../models/clothing/closet.model');
const Account = require('../models/account.model');
const { clothingService } = require('../services');

const getClothes = catchAsync(async (req, res) => { 
  const result = await clothingService.queryClothes(req.params.closet);
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

const createGarment = catchAsync(async (req, res) => {
  const closet = await Closet.findById(req.body.closetId);
  const garment = await clothingService.createGarment(req.body, closet);
  res.status(httpStatus.CREATED).send(garment);
});

const updateGarment = catchAsync(async (req, res) => {
  const garment = await clothingService.updateGarmentById(req.params.garmentId, req.body);
  res.status(httpStatus.OK).send(garment);
});

const deleteGarment = catchAsync(async (req, res) => {
  await clothingService.deleteGarmentById(req.params.garmentId);
  res.status(httpStatus.OK).send("garment");
});

module.exports = {
  getClothes,
  getAllClothes,
  getGarment,
  createGarment,
  updateGarment,
  deleteGarment,
};
