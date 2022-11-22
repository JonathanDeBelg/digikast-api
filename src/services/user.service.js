const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const {fi} = require("faker/lib/locales");

/**
 * Create a user
 * @param {Object} userBody
 * @param {Account} account
 * @returns {Promise<User>}
 */
const createUser = async (userBody, account) => {
  let user = new User();
  if (typeof userBody.email !== 'undefined') {
    if (await User.isEmailTaken(userBody.email)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email is al in gebruik.');
    }

    user = new User({
      name: userBody.name,
      email: userBody.email,
      password: userBody.password,
      account: account.id,
    });
  } else {
    if (await User.isDeviceIdAlreadyRegistered(userBody.deviceId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Device already registered');
    }

    user = new User({
      deviceId: userBody.deviceId,
      account: account.id,
      email: null,
    });
  }

  user.save(function (err) {
    if (err) throw new ApiError(httpStatus.BAD_REQUEST, err);
  });

  return user;
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

/**
 * Get user by deviceId
 * @param {string} deviceId
 * @returns {Promise<User>}
 */
const getUserByDeviceId = async (deviceId) => {
  return User.findOne({ deviceId });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Gebruiker is niet gevonden.');
  }
  if (await User.isEmailTaken(updateBody.email, userId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email is al in gebruik.');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  getUserByDeviceId,
};
