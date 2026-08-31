const express = require('express');
const { getBlogs, getBlogBySlug } = require('../controllers/blogController');
const { submitContact } = require('../controllers/contactController');

const router = express.Router();

router.get('/blog', getBlogs);
router.get('/blog/:slug', getBlogBySlug);
router.post('/contact', submitContact);

module.exports = router;
