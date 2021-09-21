const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const Account = require('../models/account.model');
const { closetService } = require('../services');

const getClosets = catchAsync(async (req, res) => {
  const accountId = await Account.findById(req.user.account);
  const result = await closetService.queryClosets(accountId);
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
  const closet = await closetService.addClothesById(req.params.closetId, req.body);
  res.status(httpStatus.OK).send(closet);
});

const deleteCloset = catchAsync(async (req, res) => {
  const closet = await closetService.deleteClosetById(req.params.closetId);
  res.status(httpStatus.OK).send(closet);
});

module.exports = {
  getClosets,
  getCloset,
  createCloset,
  updateCloset,
  addClothesToCloset,
  deleteCloset,
};
