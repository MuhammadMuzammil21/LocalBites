const express = require('express');
const router = express.Router();
const {
  createRestaurant,
  getRestaurants,
  getRestaurant,
  updateRestaurant,
  deleteRestaurant,
} = require('../controllers/restaurantController');

const protect = require('../middleware/authMiddleware');

router.route('/').get(getRestaurants).post(protect, createRestaurant);
router
  .route('/:idOrSlug')
  .get(getRestaurant)
  .put(protect, updateRestaurant)
  .delete(protect, deleteRestaurant);

module.exports = router;
