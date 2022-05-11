const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Closet } = require('../models');

const clothesService = require('./clothing.service');
const { numberOfClosets } = require('../config/account');

/**
 * Query for closets
 * @param {Object} accountId - Mongo filter
 * @returns {Promise<QueryResult>}
 */
const queryClosets = async (accountId) => {
  const closets = await Closet.find({
    account: accountId,
  });
  return closets;
};

/**
 * Get closet by id
 * @param {ObjectId} id
 * @returns {Promise<Closet>}
 */
const getClosetById = async (id) => {
  return Closet.findById(id);
};

const numberofClosestBelowMax = async (account, type) => {
  const configVar = type ? numberOfClosets.CLOSET : numberOfClosets.SUITCASE;

  return Closet.where({ account, type }).countDocuments(function (err, count) {
    if (err) return handleError(err);
    return count <= configVar;
  });
};

const createCloset = async (closetBody, account) => {
  if (await Closet.isNameDuplicate(closetBody.name)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Name is duplicate');
  }

  // if (!(await numberofClosestBelowMax(account, closetBody.type))) {
  //   const closetType = closetBody.type ? 'closets' : 'suitcases';
  //   throw new ApiError(httpStatus.BAD_REQUEST, `Too many ${closetType}`);
  // }

  const closet = await Closet.create({
    name: closetBody.name,
    account,
    type: closetBody.type,
  });
  return closet;
};

const updateClosetById = async (closetId, updateRequest) => {
  const closet = await getClosetById(closetId);
  if (!closet) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Closet not found');
  }

  if (await Closet.isNameDuplicate(updateRequest.name, closet.id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Name is duplicate');
  }
  Object.assign(closet, updateRequest);
  await closet.save();
  return closet;
};

const addClothesById = async (closetId, updateRequest) => {
  const closet = await getClosetById(closetId);
  if (!closet) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Closet not found');
  }

  updateRequest.forEach((element) => clothesService.changeCloset(closet, element));

  Object.assign(closet, updateRequest);
  await closet.save();
  return closet;
};

const deleteClosetById = async (closetId) => {
  const closet = await getClosetById(closetId);
  if (!closet) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Closet not found');
  }

  await closet.remove();
  return closet;
};

module.exports = {
  queryClosets,
  getClosetById,
  createCloset,
  updateClosetById,
  addClothesById,
  deleteClosetById,
};
