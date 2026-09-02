const express = require('express');
const rateLimit = require('express-rate-limit');
const {
  registerUser, loginUser, getMe, updateProfile, forgotPassword, resetPassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  registerRules, loginRules, forgotPasswordRules, resetPasswordRules,
} = require('../validators');

const router = express.Router();
const resetLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });

router.post('/register', registerRules, validate, registerUser);
router.post('/login', loginRules, validate, loginUser);
router.post('/forgot-password', resetLimiter, forgotPasswordRules, validate, forgotPassword);
router.post('/reset-password', resetLimiter, resetPasswordRules, validate, resetPassword);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;
