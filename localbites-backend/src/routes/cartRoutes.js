const express = require('express');
const { addToCart, getCart, removeFromCart } = require('../controllers/cartController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/add', auth, addToCart);
router.get('/', auth, getCart);
router.delete('/remove', auth, removeFromCart);

module.exports = router;
