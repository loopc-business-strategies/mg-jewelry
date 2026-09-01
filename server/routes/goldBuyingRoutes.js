const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const upload = require('../middleware/upload');
const { protect, adminOnly } = require('../middleware/auth');
const {
  createLead, getLeads, getLeadById, updateLead, getLeadStats,
} = require('../controllers/goldBuyingController');

const leadLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 10, message: 'Too many requests. Please try again later.' });

router.post('/leads', leadLimiter, (req, res, next) => {
  req.uploadFolder = 'uploads/gold-leads';
  next();
}, upload.array('images', 5), createLead);

router.get('/leads', protect, adminOnly, getLeads);
router.get('/leads/stats', protect, adminOnly, getLeadStats);
router.get('/leads/:id', protect, adminOnly, getLeadById);
router.put('/leads/:id', protect, adminOnly, updateLead);

module.exports = router;
