const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'PKR',
    },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Card', 'Stripe', 'PayPal'],
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Completed', 'Failed', 'Refunded', 'Partially_Refunded'],
      default: 'Pending',
    },
    // Stripe specific fields
    stripePaymentIntentId: String,
    stripeChargeId: String,
    stripeRefundId: String,
    // PayPal specific fields
    paypalOrderId: String,
    paypalCaptureId: String,
    paypalRefundId: String,
    // Transaction details
    transactionId: {
      type: String,
      unique: true,
      sparse: true,
    },
    receiptUrl: String,
    refundAmount: {
      type: Number,
      default: 0,
    },
    refundReason: String,
    metadata: {
      type: Map,
      of: String,
    },
    errorMessage: String,
    processedAt: Date,
    refundedAt: Date,
  },
  { timestamps: true }
);

// Generate transaction ID before saving
paymentSchema.pre('save', function(next) {
  if (!this.transactionId) {
    this.transactionId = 'TXN' + Date.now().toString().slice(-10) + Math.random().toString(36).substr(2, 6).toUpperCase();
  }
  next();
});

// Index for efficient queries
paymentSchema.index({ order: 1 });
paymentSchema.index({ user: 1, createdAt: -1 });
paymentSchema.index({ restaurant: 1, createdAt: -1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ transactionId: 1 });

// Method to process refund
paymentSchema.methods.processRefund = function(amount, reason) {
  this.refundAmount = amount;
  this.refundReason = reason;
  this.status = amount >= this.amount ? 'Refunded' : 'Partially_Refunded';
  this.refundedAt = new Date();
  return this.save();
};

// Static method to get payment statistics
paymentSchema.statics.getPaymentStats = function(restaurantId, startDate, endDate) {
  const matchStage = {
    restaurant: restaurantId,
    status: 'Completed',
  };

  if (startDate && endDate) {
    matchStage.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: '$amount' },
        totalTransactions: { $sum: 1 },
        averageAmount: { $avg: '$amount' },
      },
    },
  ]);
};

module.exports = mongoose.model('Payment', paymentSchema); 