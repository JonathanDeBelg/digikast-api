const catchAsync = require('../utils/catchAsync');
const { imageService } = require('../services');

const removeImageBackground = catchAsync(async (req, res) => {
  const result = await imageService.removeImageBackground(req);
  res.send(result);
});

module.exports = {
  removeImageBackground,
};
