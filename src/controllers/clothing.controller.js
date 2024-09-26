const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const Closet = require('../models/clothing/closet.model');
require('../models/account.model');
const { clothingService } = require('../services');
const { uploadFile } = require('../utils/AWSFileUploader');
const { removeBackground } = require('../utils/BackgroundRemoverPhotoScissors');
const Account = require('../models/account.model');

const getClothes = catchAsync(async (req, res) => {
  const result = await clothingService.queryClothesByCloset(req.params.closet);
  res.send(result);
});

const getAllClothes = catchAsync(async (req, res) => {
  const accountId = await Account.findById(req.user.account);
  const result = await clothingService.queryAllClothes(accountId);
  res.send(result);
});

const getGarment = catchAsync(async (req, res) => {
  const garment = await clothingService.getGarmentById(req.params.garmentId);
  if (!garment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Garment not found');
  }
  res.send(garment);
});

const getGarmentSetsByClosetId = catchAsync(async (req, res) => {
  const accountId = await Account.findById(req.user.account);
  const result = await clothingService.queryGarmentSetsByCloset(accountId, req.params.closet);
  res.send(result);
});

const getAllGarmentSets = catchAsync(async (req, res) => {
  console.log(req.body);
  const accountId = await Account.findById(req.user.account);
  const result = await clothingService.queryGarmentSets(accountId);
  res.send(result);
});

const getComperableGarments = catchAsync(async (req, res) => {
  const accountId = await Account.findById(req.user.account);
  const garments = await clothingService.getComparableItemsByGarmentId(accountId, req.params.garment);
  res.send(garments);
});

const createGarment = catchAsync(async (req, res) => {
  let filePath = '';
  if (req.body.closetItemType === 'garment') {
    const removedBackground = await removeBackground(req.file);
    filePath = await uploadFile(removedBackground, req);
  } else {
    filePath = await uploadFile(req.file.buffer, req);
  }
  const closet = await Closet.findById(req.body.closetId);
  const account = await Account.findById(req.user.account);

  if (closet == null) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Closet doesn't exist yet");
  }
  const garment = await clothingService.createGarment(req, closet, account, filePath);
  res.status(httpStatus.CREATED).send(garment);
});

const createGarmentSet = catchAsync(async (req, res) => {
  const closet = await Closet.findById(req.body.closetId);
  const account = await Account.findById(req.user.account);

  const garment = await clothingService.createGarmentSet(req, closet, account);
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

const changeGarmentCloset = catchAsync(async (req, res) => {
  await clothingService.changeCloset(req.body.closet, req.params.garmentId);
  res.status(httpStatus.OK).send('Successfully changed closet');
});

module.exports = {
  getClothes,
  getAllClothes,
  getGarment,
  getGarmentSetsByClosetId,
  getComperableGarments,
  createGarment,
  updateGarment,
  deleteGarment,
  createGarmentSet,
  getAllGarmentSets,
  changeGarmentCloset,
};
