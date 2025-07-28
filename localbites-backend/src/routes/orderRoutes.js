const express = require('express');
const { placeOrder, getUserOrders } = require('../controllers/orderController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', auth, placeOrder);
router.get('/', auth, getUserOrders);

module.exports = router;
