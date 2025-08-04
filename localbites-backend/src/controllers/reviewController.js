const asyncHandler = require('../utils/asyncHandler');
const Review = require('../models/Review');
const Restaurant = require('../models/Restaurant');
const Notification = require('../models/Notification');

// Create a review
const createReview = asyncHandler(async (req, res) => {
  const { restaurantId, rating, title, comment, images } = req.body;

  // Check if user has already reviewed this restaurant
  const existingReview = await Review.findOne({
    user: req.user.id,
    restaurant: restaurantId,
  });

  if (existingReview) {
    return res.status(400).json({
      success: false,
      message: 'You have already reviewed this restaurant',
    });
  }

  // Check if user has ordered from this restaurant
  const Order = require('../models/Order');
  const hasOrdered = await Order.findOne({
    user: req.user.id,
    restaurant: restaurantId,
    status: 'Delivered',
  });

  if (!hasOrdered) {
    return res.status(400).json({
      success: false,
      message: 'You can only review restaurants you have ordered from',
    });
  }

  const review = await Review.create({
    user: req.user.id,
    restaurant: restaurantId,
    rating,
    title,
    comment,
    images: images || [],
  });

  // Update restaurant average rating
  await updateRestaurantRating(restaurantId);

  // Notify restaurant owner
  const restaurant = await Restaurant.findById(restaurantId).populate('owner_id');
  if (restaurant.owner_id) {
    await Notification.create({
      recipient: restaurant.owner_id._id,
      type: 'REVIEW_RECEIVED',
      title: 'New Review Received',
      message: `You received a ${rating}-star review for ${restaurant.name}`,
      data: {
        restaurantId: restaurant._id,
        reviewId: review._id,
      },
    });
  }

  const populatedReview = await Review.findById(review._id)
    .populate('user', 'name')
    .populate('restaurant', 'name');

  res.status(201).json({
    success: true,
    message: 'Review submitted successfully',
    review: populatedReview,
  });
});

// Get reviews for a restaurant
const getRestaurantReviews = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;
  const { page = 1, limit = 10, rating, sort = 'newest' } = req.query;
  const skip = (page - 1) * limit;

  const filter = { restaurant: restaurantId, isHidden: false };
  if (rating) {
    filter.rating = parseInt(rating);
  }

  let sortOption = {};
  switch (sort) {
    case 'newest':
      sortOption = { createdAt: -1 };
      break;
    case 'oldest':
      sortOption = { createdAt: 1 };
      break;
    case 'highest':
      sortOption = { rating: -1 };
      break;
    case 'lowest':
      sortOption = { rating: 1 };
      break;
    case 'helpful':
      sortOption = { helpfulCount: -1 };
      break;
    default:
      sortOption = { createdAt: -1 };
  }

  const reviews = await Review.find(filter)
    .populate('user', 'name')
    .populate('ownerReply')
    .sort(sortOption)
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Review.countDocuments(filter);

  // Get rating distribution
  const ratingDistribution = await Review.aggregate([
    { $match: { restaurant: restaurantId, isHidden: false } },
    {
      $group: {
        _id: '$rating',
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: -1 } },
  ]);

  res.status(200).json({
    success: true,
    reviews,
    pagination: {
      current: parseInt(page),
      total: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
    ratingDistribution,
  });
});

// Update a review
const updateReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const { rating, title, comment, images } = req.body;

  const review = await Review.findById(reviewId);

  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found',
    });
  }

  if (review.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this review',
    });
  }

  review.rating = rating || review.rating;
  review.title = title || review.title;
  review.comment = comment || review.comment;
  review.images = images || review.images;

  await review.save();

  // Update restaurant average rating
  await updateRestaurantRating(review.restaurant);

  const updatedReview = await Review.findById(reviewId)
    .populate('user', 'name')
    .populate('restaurant', 'name');

  res.status(200).json({
    success: true,
    message: 'Review updated successfully',
    review: updatedReview,
  });
});

// Delete a review
const deleteReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;

  const review = await Review.findById(reviewId);

  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found',
    });
  }

  if (review.user.toString() !== req.user.id && req.user.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this review',
    });
  }

  await Review.findByIdAndDelete(reviewId);

  // Update restaurant average rating
  await updateRestaurantRating(review.restaurant);

  res.status(200).json({
    success: true,
    message: 'Review deleted successfully',
  });
});

// Mark review as helpful
const markHelpful = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;

  const review = await Review.findById(reviewId);

  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found',
    });
  }

  const helpfulIndex = review.helpful.findIndex(
    (h) => h.user.toString() === req.user.id
  );

  if (helpfulIndex > -1) {
    // Remove helpful mark
    review.helpful.splice(helpfulIndex, 1);
  } else {
    // Add helpful mark
    review.helpful.push({ user: req.user.id });
  }

  await review.save();

  res.status(200).json({
    success: true,
    message: helpfulIndex > -1 ? 'Removed helpful mark' : 'Marked as helpful',
    helpfulCount: review.helpful.length,
  });
});

// Owner reply to review
const replyToReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const { comment } = req.body;

  const review = await Review.findById(reviewId).populate('restaurant', 'owner_id');

  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found',
    });
  }

  // Check if user is the restaurant owner
  if (review.restaurant.owner_id.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Only restaurant owner can reply to reviews',
    });
  }

  review.ownerReply = {
    comment,
    repliedAt: new Date(),
  };

  await review.save();

  // Notify review author
  await Notification.create({
    recipient: review.user,
    type: 'REVIEW_REPLIED',
    title: 'Owner Replied to Your Review',
    message: `The owner of ${review.restaurant.name} replied to your review`,
    data: {
      restaurantId: review.restaurant._id,
      reviewId: review._id,
    },
  });

  const updatedReview = await Review.findById(reviewId)
    .populate('user', 'name')
    .populate('restaurant', 'name');

  res.status(200).json({
    success: true,
    message: 'Reply added successfully',
    review: updatedReview,
  });
});

// Get user's reviews
const getUserReviews = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const reviews = await Review.find({ user: req.user.id })
    .populate('restaurant', 'name images')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Review.countDocuments({ user: req.user.id });

  res.status(200).json({
    success: true,
    reviews,
    pagination: {
      current: parseInt(page),
      total: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  });
});

// Helper function to update restaurant rating
const updateRestaurantRating = async (restaurantId) => {
  const stats = await Review.aggregate([
    { $match: { restaurant: restaurantId, isHidden: false } },
    {
      $group: {
        _id: null,
        avgRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Restaurant.findByIdAndUpdate(restaurantId, {
      avg_rating: Math.round(stats[0].avgRating * 10) / 10,
      review_count: stats[0].reviewCount,
    });
  }
};

module.exports = {
  createReview,
  getRestaurantReviews,
  updateReview,
  deleteReview,
  markHelpful,
  replyToReview,
  getUserReviews,
}; 