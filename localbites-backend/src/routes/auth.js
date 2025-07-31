const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  forgotPassword, 
  resetPassword, 
  getProfile, 
  updateProfile, 
  changePassword,
  getAllUsers,
  updateUserStatus
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

// Protected routes
router.get('/me', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

// Admin routes
router.get('/users', protect, admin, getAllUsers);
router.put('/users/:id/status', protect, admin, updateUserStatus);

module.exports = router;
