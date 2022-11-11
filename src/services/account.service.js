const { accountTypes } = require('../config/account');
const { Account } = require('../models');

/**
 * Create a user
 * @returns {Promise<User>}
 */
const createAccount = async (requestBody) => {
  const account = new Account({
    name: requestBody.name,
    type: accountTypes[requestBody.account],
  });

  await account.save();
  return account;
};

const createDeviceAccount = async (requestBody) => {
  const account = new Account({
    type: accountTypes[requestBody.account],
  });

  await account.save();
  return account;
};

module.exports = {
  createAccount,
  createDeviceAccount,
};
