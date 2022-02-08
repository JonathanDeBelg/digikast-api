require('aws-sdk');
const { uploadFile } = require('../utils/AWSFileUploader');
const { removeBackground } = require('../utils/BackgroundRemover');

const removeImageBackground = async (req) => {
  const backgroundRemovedImg = await removeBackground(req);
  const filePath = await uploadFile(backgroundRemovedImg, req);
  return filePath.Location;
};

module.exports = {
  removeImageBackground,
};
