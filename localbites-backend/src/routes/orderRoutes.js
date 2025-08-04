const express = require('express');
const {
  placeOrder,
  getUserOrders,
  getOrderByTrackingCode,
  cancelOrder,
  reorder,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// User routes (require authentication)
router.use(protect);

// Order management
router.post('/', placeOrder);
router.get('/', getUserOrders);
router.get('/tracking/:trackingCode', getOrderByTrackingCode);
router.put('/:orderId/cancel', cancelOrder);
router.post('/:orderId/reorder', reorder);

// Admin/Owner routes
router.get('/all', admin, getAllOrders);
router.put('/:orderId/status', updateOrderStatus);

module.exports = router;
