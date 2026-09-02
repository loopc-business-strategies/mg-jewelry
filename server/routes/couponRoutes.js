const express = require('express');
const { applyCoupon, removeCoupon } = require('../controllers/couponController');
const { getCoupons, createCoupon, updateCoupon, deleteCoupon } = require('../controllers/couponController');
const { protect } = require('../middleware/auth');
const { requirePermission } = require('../middleware/permissions');
const validate = require('../middleware/validate');
const { couponRules, mongoIdParam } = require('../validators');

const router = express.Router();

router.post('/apply-coupon', protect, couponRules, validate, applyCoupon);
router.delete('/coupon', protect, removeCoupon);

const adminRouter = express.Router();
adminRouter.use(protect, requirePermission('coupons'));
adminRouter.get('/', getCoupons);
adminRouter.post('/', createCoupon);
adminRouter.put('/:id', mongoIdParam, validate, updateCoupon);
adminRouter.delete('/:id', mongoIdParam, validate, deleteCoupon);

module.exports = { couponCartRoutes: router, couponAdminRoutes: adminRouter };
