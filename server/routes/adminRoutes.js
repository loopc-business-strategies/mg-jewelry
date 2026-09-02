const express = require('express');
const {
  getDashboard, getAllOrders, updateOrderStatus,
  getWholesaleApplications, approveWholesale, rejectWholesale, suspendWholesale,
  getWholesaleOrders, updateWholesaleOrderStatus,
  getInquiries, getBulkPricing, updateBulkPricing, getCustomers,
  getGoldRatesAdmin, updateGoldRates, getAuditLogs, deleteDemoProducts, deleteDemoData, downloadInvoice,
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
const { getPendingReviews, moderateReview } = require('../controllers/reviewController');
const { protect, adminOnly } = require('../middleware/auth');
const { requirePermission } = require('../middleware/permissions');

const router = express.Router();

router.use(protect, adminOnly);

router.get('/dashboard', getDashboard);
router.get('/orders', getAllOrders);
router.put('/orders/:id', requirePermission('orders'), updateOrderStatus);
router.get('/orders/:id/invoice', requirePermission('invoices'), downloadInvoice);
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
router.get('/settings/gold-rates', getGoldRatesAdmin);
router.put('/settings/gold-rates', updateGoldRates);
router.get('/audit-logs', getAuditLogs);
router.delete('/demo-products', deleteDemoProducts);
router.delete('/demo-data', deleteDemoData);
router.get('/reviews/pending', requirePermission('reviews'), getPendingReviews);
router.put('/reviews/:id', requirePermission('reviews'), moderateReview);
router.post('/products', requirePermission('products'), createProduct);
router.put('/products/:id', requirePermission('products'), updateProduct);
router.delete('/products/:id', requirePermission('products'), deleteProduct);
router.post('/categories', requirePermission('categories'), createCategory);
router.put('/categories/:id', requirePermission('categories'), updateCategory);
router.delete('/categories/:id', requirePermission('categories'), deleteCategory);
router.post('/blog', requirePermission('blog'), createBlog);
router.put('/blog/:id', requirePermission('blog'), updateBlog);
router.delete('/blog/:id', requirePermission('blog'), deleteBlog);

module.exports = router;
