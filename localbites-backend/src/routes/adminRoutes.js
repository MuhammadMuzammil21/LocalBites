const express = require('express');
const { getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');
const {
    getTotalOrders,
    getTotalRevenue,
    getOrdersByDate,
    getOrdersByStatus,
    getTopRestaurants,
  } = require('../controllers/adminStatsController');

const router = express.Router();

router.get('/orders', auth, admin, getAllOrders);
router.put('/orders/:orderId/status', auth, admin, updateOrderStatus);
router.get('/stats/orders', auth, admin, getTotalOrders);
router.get('/stats/revenue', auth, admin, getTotalRevenue);
router.get('/stats/orders-by-date', auth, admin, getOrdersByDate);
router.get('/stats/status', auth, admin, getOrdersByStatus);
router.get('/stats/top-restaurants', auth, admin, getTopRestaurants);
  

module.exports = router;
