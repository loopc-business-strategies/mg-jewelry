const express = require('express');
const { subscribe } = require('../controllers/newsletterController');
const validate = require('../middleware/validate');
const { newsletterRules } = require('../validators');

const router = express.Router();

router.post('/newsletter', newsletterRules, validate, subscribe);

module.exports = router;
