const express = require('express');
const router = express.Router();
const {
  createPaymentIntent,
  confirmPayment,
  processRefund,
  getPaymentHistory,
  getPaymentDetails,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

// Payment processing routes
router.post('/create-payment-intent', createPaymentIntent);
router.post('/confirm-payment', confirmPayment);
router.post('/refund', processRefund);

// Payment history and details
router.get('/history', getPaymentHistory);
router.get('/:paymentId', getPaymentDetails);

module.exports = router; 