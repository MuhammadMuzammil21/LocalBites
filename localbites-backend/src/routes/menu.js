const express = require('express');
const router = express.Router();
const {
  addMenuItem,
  getMenuItems,
  getMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require('../controllers/menuItemController');

const { protect } = require('../middleware/authMiddleware');

// For a restaurant
router.route('/:restaurantId').get(getMenuItems).post(protect, addMenuItem);

// Individual item
router
  .route('/item/:id')
  .get(getMenuItem)
  .put(protect, updateMenuItem)
  .delete(protect, deleteMenuItem);

module.exports = router;
