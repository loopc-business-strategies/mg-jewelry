const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');
const ApiError = require('../utils/ApiError');

const updateProductRating = async (productId) => {
  const reviews = await Review.find({ productId, isApproved: true });
  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;
  await Product.findByIdAndUpdate(productId, {
    rating: Math.round(avgRating * 10) / 10,
    reviewCount: reviews.length,
  });
};

const getProductReviews = async (req, res) => {
  const reviews = await Review.find({ productId: req.params.id, isApproved: true })
    .populate('userId', 'name')
    .sort({ createdAt: -1 });
  res.json({ success: true, data: reviews });
};

const createReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const existing = await Review.findOne({ productId: req.params.id, userId: req.user._id });
    if (existing) throw new ApiError('You already reviewed this product', 400, 'DUPLICATE_REVIEW');

    const deliveredOrder = await Order.findOne({
      userId: req.user._id,
      status: 'delivered',
      'items.productId': req.params.id,
    });

    const review = await Review.create({
      productId: req.params.id,
      userId: req.user._id,
      rating,
      comment,
      isApproved: false,
      verifiedPurchase: Boolean(deliveredOrder),
    });

    await updateProductRating(req.params.id);
    res.status(201).json({ success: true, data: review });
  } catch (err) {
    next(err);
  }
};

const getPendingReviews = async (req, res) => {
  const reviews = await Review.find({ isApproved: false }).populate('userId productId', 'name').sort({ createdAt: -1 });
  res.json({ success: true, data: reviews });
};

const moderateReview = async (req, res, next) => {
  try {
    const { action } = req.body;
    const review = await Review.findById(req.params.id);
    if (!review) throw new ApiError('Review not found', 404, 'NOT_FOUND');
    if (action === 'approve') review.isApproved = true;
    else if (action === 'reject') await review.deleteOne();
    else throw new ApiError('Invalid action', 400, 'VALIDATION_ERROR');
    if (action === 'approve') await review.save();
    await updateProductRating(review.productId);
    res.json({ success: true, message: `Review ${action}d` });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProductReviews, createReview, getPendingReviews, moderateReview };
