const Newsletter = require('../models/Newsletter');
const ApiError = require('../utils/ApiError');

const subscribe = async (req, res, next) => {
  try {
    const { email } = req.body;
    const existing = await Newsletter.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.json({ success: true, message: 'Thank you for subscribing!' });
    }
    await Newsletter.create({ email: email.toLowerCase() });
    res.status(201).json({ success: true, message: 'Thank you for subscribing!' });
  } catch (err) {
    next(err);
  }
};

module.exports = { subscribe };
