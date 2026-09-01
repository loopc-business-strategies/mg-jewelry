const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { protect, adminOnly } = require('../middleware/auth');
const {
  createRFQ, getMyRFQs, getRFQById, getAllRFQs, updateRFQ,
  createQuote, getQuotes, getAllQuotes, updateQuote,
} = require('../controllers/rfqController');

const rfqLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 20, message: 'Too many RFQ requests.' });

router.post('/', protect, rfqLimiter, createRFQ);
router.get('/my', protect, getMyRFQs);
router.get('/quotes/my', protect, getQuotes);
router.get('/quotes/all', protect, adminOnly, getAllQuotes);
router.put('/quotes/:id', protect, adminOnly, updateQuote);
router.get('/', protect, adminOnly, getAllRFQs);
router.get('/:id', protect, getRFQById);
router.put('/:id', protect, adminOnly, updateRFQ);
router.post('/:id/quote', protect, adminOnly, createQuote);

module.exports = router;
