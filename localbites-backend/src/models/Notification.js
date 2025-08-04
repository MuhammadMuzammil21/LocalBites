const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: [
        'ORDER_CONFIRMED',
        'ORDER_PREPARING',
        'ORDER_READY',
        'ORDER_DELIVERED',
        'ORDER_CANCELLED',
        'PAYMENT_SUCCESS',
        'PAYMENT_FAILED',
        'REVIEW_RECEIVED',
        'REVIEW_REPLIED',
        'PROMOTION',
        'SYSTEM_UPDATE',
        'NEW_RESTAURANT',
        'DELIVERY_UPDATE',
        'REFUND_PROCESSED'
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 100,
    },
    message: {
      type: String,
      required: true,
      maxlength: 500,
    },
    data: {
      orderId: mongoose.Schema.Types.ObjectId,
      restaurantId: mongoose.Schema.Types.ObjectId,
      reviewId: mongoose.Schema.Types.ObjectId,
      amount: Number,
      trackingCode: String,
      // Additional context data
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    isEmailSent: {
      type: Boolean,
      default: false,
    },
    isPushSent: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    expiresAt: {
      type: Date,
      // Default to 30 days from creation
      default: function() {
        return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      },
    },
  },
  { timestamps: true }
);

// Index for efficient queries
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ type: 1, createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

// Method to mark as read
notificationSchema.methods.markAsRead = function() {
  this.isRead = true;
  return this.save();
};

// Static method to create notification
notificationSchema.statics.createNotification = function(data) {
  return this.create(data);
};

// Static method to get unread count
notificationSchema.statics.getUnreadCount = function(userId) {
  return this.countDocuments({ recipient: userId, isRead: false });
};

module.exports = mongoose.model('Notification', notificationSchema); 