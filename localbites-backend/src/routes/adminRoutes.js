const express = require('express');
const { getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { getAllUsers } = require('../controllers/authController');
const {
    getTotalOrders,
    getTotalRevenue,
    getOrdersByDate,
    getOrdersByStatus,
    getTopRestaurants,
  } = require('../controllers/adminStatsController');

const router = express.Router();

// Apply middleware to each route individually
router.get('/users', protect, authorize('ADMIN'), getAllUsers);
router.get('/orders', protect, authorize('ADMIN'), getAllOrders);
router.put('/orders/:orderId/status', protect, authorize('ADMIN'), updateOrderStatus);
router.get('/stats/orders', protect, authorize('ADMIN'), getTotalOrders);
router.get('/stats/revenue', protect, authorize('ADMIN'), getTotalRevenue);
router.get('/stats/orders-by-date', protect, authorize('ADMIN'), getOrdersByDate);
router.get('/stats/status', protect, authorize('ADMIN'), getOrdersByStatus);
router.get('/stats/top-restaurants', protect, authorize('ADMIN'), getTopRestaurants);

module.exports = router;

