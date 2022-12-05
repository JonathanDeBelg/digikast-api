const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const Account = require('../models/account.model');
const { closetService, clothingService } = require('../services');

const getClosets = catchAsync(async (req, res) => {
  const accountId = await Account.findById(req.user.account);
  const closets = await closetService.queryClosets(accountId);
  const result = {};
  print(closets)

  for (const key in closets) {
    const garments = await clothingService.queryLastAddedNoClothes(closets[key].id, 3);
    result[closets[key].id] = {
      id: closets[key].id,
      name: closets[key].name,
      account: closets[key].account,
      type: closets[key].type,
      preview: garments,
    };
  }

  res.send(result);
});

const getCloset = catchAsync(async (req, res) => {
  const closet = await closetService.getClosetById(req.params.closetId);
  if (!closet) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Closet not found');
  }
  res.send(closet);
});

const createCloset = catchAsync(async (req, res) => {
  const account = await Account.findById(req.user.account);
  const closet = await closetService.createCloset(req.body, account);
  res.status(httpStatus.CREATED).send(closet);
});

const updateCloset = catchAsync(async (req, res) => {
  const closet = await closetService.updateClosetById(req.params.closetId, req.body);
  res.status(httpStatus.OK).send(closet);
});

const addClothesToCloset = catchAsync(async (req, res) => {
  const closet = await closetService.getClosetById(req.params.closetId);
  if (!closet) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Closet not found');
  }

  if (closet.type === true) {
    await closetService.addClothesById(closet, req.body);
  } else {
    await closetService.copyClothesById(closet, req.body);
  }
  res.status(httpStatus.OK).send(closet);
});

const addClothesToSuitcase = catchAsync(async (req, res) => {
  const closet = await closetService.copyClothesById(req.params.closetId, req.body);
  res.status(httpStatus.OK).send(closet);
});

const deleteCloset = catchAsync(async (req, res) => {
  const closet = await closetService.getClosetById(req.params.closetId);
  if (!closet) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Closet not found');
  }

  if (closet.type !== true) {
    await closetService.deleteSuitcase(closet);
  } else {
    await closetService.deleteCloset(closet);
  }
  res.status(httpStatus.OK).send(closet);
});

module.exports = {
  getClosets,
  getCloset,
  createCloset,
  updateCloset,
  addClothesToCloset,
  addClothesToSuitcase,
  deleteCloset,
};
