const asyncHandler = require('../utils/asyncHandler');
const Notification = require('../models/Notification');

// Get user notifications
const getUserNotifications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, unreadOnly = false } = req.query;
  const skip = (page - 1) * limit;

  const filter = { recipient: req.user.id };
  if (unreadOnly === 'true') {
    filter.isRead = false;
  }

  const notifications = await Notification.find(filter)
    .populate('data.orderId', 'trackingCode status')
    .populate('data.restaurantId', 'name')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Notification.countDocuments(filter);
  const unreadCount = await Notification.countDocuments({
    recipient: req.user.id,
    isRead: false,
  });

  res.status(200).json({
    success: true,
    notifications,
    unreadCount,
    pagination: {
      current: parseInt(page),
      total: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  });
});

// Mark notification as read
const markAsRead = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;

  const notification = await Notification.findById(notificationId);

  if (!notification) {
    return res.status(404).json({
      success: false,
      message: 'Notification not found',
    });
  }

  if (notification.recipient.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this notification',
    });
  }

  notification.isRead = true;
  await notification.save();

  res.status(200).json({
    success: true,
    message: 'Notification marked as read',
  });
});

// Mark all notifications as read
const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { recipient: req.user.id, isRead: false },
    { isRead: true }
  );

  res.status(200).json({
    success: true,
    message: 'All notifications marked as read',
  });
});

// Delete notification
const deleteNotification = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;

  const notification = await Notification.findById(notificationId);

  if (!notification) {
    return res.status(404).json({
      success: false,
      message: 'Notification not found',
    });
  }

  if (notification.recipient.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this notification',
    });
  }

  await Notification.findByIdAndDelete(notificationId);

  res.status(200).json({
    success: true,
    message: 'Notification deleted successfully',
  });
});

// Get notification settings (placeholder for future implementation)
const getNotificationSettings = asyncHandler(async (req, res) => {
  // This would typically fetch from a UserSettings model
  // For now, return default settings
  res.status(200).json({
    success: true,
    settings: {
      emailNotifications: true,
      pushNotifications: true,
      orderUpdates: true,
      promotions: true,
      reviews: true,
      systemUpdates: true,
    },
  });
});

// Update notification settings (placeholder for future implementation)
const updateNotificationSettings = asyncHandler(async (req, res) => {
  const { settings } = req.body;

  // This would typically update a UserSettings model
  // For now, just return success
  res.status(200).json({
    success: true,
    message: 'Notification settings updated successfully',
    settings,
  });
});

// Get unread count
const getUnreadCount = asyncHandler(async (req, res) => {
  const unreadCount = await Notification.countDocuments({
    recipient: req.user.id,
    isRead: false,
  });

  res.status(200).json({
    success: true,
    unreadCount,
  });
});

// Create notification (internal use)
const createNotification = asyncHandler(async (req, res) => {
  const { recipient, type, title, message, data, priority = 'medium' } = req.body;

  const notification = await Notification.create({
    recipient,
    type,
    title,
    message,
    data,
    priority,
  });

  res.status(201).json({
    success: true,
    notification,
  });
});

module.exports = {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getNotificationSettings,
  updateNotificationSettings,
  getUnreadCount,
  createNotification,
}; 