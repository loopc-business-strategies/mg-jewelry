const express = require('express');
const {
  getDashboard, getAllOrders, updateOrderStatus,
  getWholesaleApplications, approveWholesale, rejectWholesale, suspendWholesale,
  getWholesaleOrders, updateWholesaleOrderStatus,
  getInquiries, getBulkPricing, updateBulkPricing, getCustomers,
} = require('../controllers/adminController');
const {
  createProduct, updateProduct, deleteProduct,
} = require('../controllers/productController');
const {
  createCategory, updateCategory, deleteCategory,
} = require('../controllers/categoryController');
const {
  createBlog, updateBlog, deleteBlog,
} = require('../controllers/blogController');
const { getContacts } = require('../controllers/contactController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.use(protect, adminOnly);

router.get('/dashboard', getDashboard);
router.get('/orders', getAllOrders);
router.put('/orders/:id', updateOrderStatus);
router.get('/wholesale', getWholesaleApplications);
router.put('/wholesale/:id/approve', approveWholesale);
router.put('/wholesale/:id/reject', rejectWholesale);
router.put('/wholesale/:id/suspend', suspendWholesale);
router.get('/wholesale-orders', getWholesaleOrders);
router.put('/wholesale-orders/:id', updateWholesaleOrderStatus);
router.get('/inquiries', getInquiries);
router.get('/customers', getCustomers);
router.get('/contacts', getContacts);
router.get('/settings/bulk-pricing', getBulkPricing);
router.put('/settings/bulk-pricing', updateBulkPricing);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);
router.post('/blog', createBlog);
router.put('/blog/:id', updateBlog);
router.delete('/blog/:id', deleteBlog);

module.exports = router;
