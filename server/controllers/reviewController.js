const Review = require('../models/Review');
const Product = require('../models/Product');

const getProductReviews = async (req, res) => {
  const reviews = await Review.find({ productId: req.params.id, isApproved: true })
    .populate('userId', 'name')
    .sort({ createdAt: -1 });
  res.json(reviews);
};

const createReview = async (req, res) => {
  const { rating, comment } = req.body;
  const review = await Review.create({
    productId: req.params.id,
    userId: req.user._id,
    rating,
    comment,
  });

  const reviews = await Review.find({ productId: req.params.id, isApproved: true });
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  await Product.findByIdAndUpdate(req.params.id, {
    rating: Math.round(avgRating * 10) / 10,
    reviewCount: reviews.length,
  });

  res.status(201).json(review);
};

module.exports = { getProductReviews, createReview };
