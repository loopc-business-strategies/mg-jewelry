const crypto = require('crypto');
const User = require('../models/User');
const WholesaleCustomer = require('../models/WholesaleCustomer');
const generateToken = require('../utils/generateToken');
const { sendPasswordResetEmail } = require('../services/emailService');
const ApiError = require('../utils/ApiError');

const registerUser = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) throw new ApiError('User already exists', 400, 'USER_EXISTS');
    const user = await User.create({ name, email, phone, password });
    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: generateToken(user._id),
      },
    });
  } catch (err) {
    next(err);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      const wholesale = await WholesaleCustomer.findOne({ userId: user._id });
      return res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          wholesaleStatus: wholesale?.status || null,
          token: generateToken(user._id),
        },
      });
    }
    throw new ApiError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res) => {
  const wholesale = await WholesaleCustomer.findOne({ userId: req.user._id });
  res.json({
    success: true,
    data: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      role: req.user.role,
      addresses: req.user.addresses,
      wholesaleStatus: wholesale?.status || null,
      wholesaleCustomer: wholesale || null,
    },
  });
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) throw new ApiError('User not found', 404, 'NOT_FOUND');
    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    if (req.body.password) user.password = req.body.password;
    if (req.body.addresses) user.addresses = req.body.addresses;
    const updated = await user.save();
    res.json({
      success: true,
      data: {
        _id: updated._id,
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        role: updated.role,
        addresses: updated.addresses,
        token: generateToken(updated._id),
      },
    });
  } catch (err) {
    next(err);
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    await sendPasswordResetEmail(user.email, resetToken);
  }
  res.json({
    success: true,
    message: 'If an account exists, a reset link has been sent to your email.',
  });
};

const resetPassword = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto.createHash('sha256').update(req.body.token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) throw new ApiError('Invalid or expired reset token', 400, 'INVALID_TOKEN');
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { registerUser, loginUser, getMe, updateProfile, forgotPassword, resetPassword };
