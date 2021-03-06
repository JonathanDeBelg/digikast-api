const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService, accountService } = require('../services');
const { uploadFile } = require('../utils/AWSFileUploader');

const register = catchAsync(async (req, res) => {
  const filePath = await uploadFile(req.file.buffer, req);
  const user = await userService.getUserByDeviceId(req.body.deviceId);

  await userService.updateUserById(user.id, {
    email: req.body.email,
    password: req.body.password,
    name: req.body.name,
    profilePicture: filePath.Location,
  });

  const tokens = await tokenService.generateAuthTokens(user);
  const newUser = await userService.getUserByEmail(req.body.email);
  res.status(httpStatus.CREATED).send({ user: newUser, tokens });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

const registerDevice = catchAsync(async (req, res) => {
  const account = await accountService.createDeviceAccount(req.body);
  const user = await userService.createUser(req.body, account);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

const loginDevice = catchAsync(async (req, res) => {
  const { deviceId } = req.body;
  const user = await authService.loginUserWithDeviceId(deviceId);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,

  registerDevice,
  loginDevice,
};
