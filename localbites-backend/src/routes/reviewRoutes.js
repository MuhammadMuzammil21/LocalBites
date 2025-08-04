const express = require('express');
const router = express.Router();
const {
  createReview,
  getRestaurantReviews,
  updateReview,
  deleteReview,
  markHelpful,
  replyToReview,
  getUserReviews,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/restaurant/:restaurantId', getRestaurantReviews);

// Protected routes
router.use(protect);

// Review management
router.post('/', createReview);
router.get('/user', getUserReviews);
router.put('/:reviewId', updateReview);
router.delete('/:reviewId', deleteReview);
router.post('/:reviewId/helpful', markHelpful);

// Owner reply (requires owner role)
router.post('/:reviewId/reply', replyToReview);

module.exports = router; 