const User = require('../models/User');
const WholesaleCustomer = require('../models/WholesaleCustomer');
const generateToken = require('../utils/generateToken');

const registerUser = async (req, res) => {
  const { name, email, phone, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({ message: 'User already exists' });
  }
  const user = await User.create({ name, email, phone, password });
  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    token: generateToken(user._id),
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    const wholesale = await WholesaleCustomer.findOne({ userId: user._id });
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      wholesaleStatus: wholesale?.status || null,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

const getMe = async (req, res) => {
  const wholesale = await WholesaleCustomer.findOne({ userId: req.user._id });
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    phone: req.user.phone,
    role: req.user.role,
    addresses: req.user.addresses,
    wholesaleStatus: wholesale?.status || null,
    wholesaleCustomer: wholesale || null,
  });
};

const updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    if (req.body.password) user.password = req.body.password;
    const updated = await user.save();
    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      role: updated.role,
      token: generateToken(updated._id),
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

const forgotPassword = async (req, res) => {
  res.json({ message: 'If an account exists, a reset link has been sent to your email.' });
};

module.exports = { registerUser, loginUser, getMe, updateProfile, forgotPassword };
