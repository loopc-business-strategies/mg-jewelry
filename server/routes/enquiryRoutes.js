const express = require('express');
const rateLimit = require('express-rate-limit');
const validate = require('../middleware/validate');
const { enquiryRules } = require('../validators');
const { submitEnquiry } = require('../controllers/enquiryController');

const router = express.Router();

const enquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many enquiries. Please try again later.' },
});

router.post('/', enquiryLimiter, enquiryRules, validate, submitEnquiry);

module.exports = router;
