const express = require('express');
const { getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { getAllUsers, updateUserStatus, deleteUser } = require('../controllers/authController');
const { getAllRestaurants, updateRestaurantStatus } = require('../controllers/restaurantController');
const {
    getStats,
    getTotalOrders,
    getTotalRevenue,
    getOrdersByDate,
    getOrdersByStatus,
    getTopRestaurants,
  } = require('../controllers/adminStatsController');

const router = express.Router();

// Stats routes
router.get('/stats', protect, authorize('ADMIN'), getStats);
router.get('/stats/orders', protect, authorize('ADMIN'), getTotalOrders);
router.get('/stats/revenue', protect, authorize('ADMIN'), getTotalRevenue);
router.get('/stats/orders-by-date', protect, authorize('ADMIN'), getOrdersByDate);
router.get('/stats/status', protect, authorize('ADMIN'), getOrdersByStatus);
router.get('/stats/top-restaurants', protect, authorize('ADMIN'), getTopRestaurants);

// User management routes
router.get('/users', protect, authorize('ADMIN'), getAllUsers);
router.put('/users/:id/status', protect, authorize('ADMIN'), updateUserStatus);
router.delete('/users/:id', protect, authorize('ADMIN'), deleteUser);

// Order management routes
router.get('/orders', protect, authorize('ADMIN'), getAllOrders);
router.put('/orders/:orderId/status', protect, authorize('ADMIN'), updateOrderStatus);

// Restaurant management routes
router.get('/restaurants', protect, authorize('ADMIN'), getAllRestaurants);
router.put('/restaurants/:id/status', protect, authorize('ADMIN'), updateRestaurantStatus);

module.exports = router;

