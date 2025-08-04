const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
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
  items: [
    {
      menuItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItem',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      price: {
        type: Number,
        required: true,
      },
      specialInstructions: String,
    },
  ],
  subtotal: {
    type: Number,
    required: true,
  },
  deliveryFee: {
    type: Number,
    default: 0,
  },
  tax: {
    type: Number,
    default: 0,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
    default: 'Pending',
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Card', 'Stripe', 'PayPal'],
    required: true,
  },
  paymentIntentId: String, // Stripe payment intent ID
  refundId: String, // Stripe refund ID if applicable
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String,
    coordinates: {
      type: [Number], // [longitude, latitude]
    },
  },
  estimatedDeliveryTime: Date,
  actualDeliveryTime: Date,
  specialInstructions: String,
  trackingCode: {
    type: String,
    unique: true,
    sparse: true,
  },
  isReordered: {
    type: Boolean,
    default: false,
  },
  originalOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Generate tracking code before saving
orderSchema.pre('save', function(next) {
  if (!this.trackingCode) {
    this.trackingCode = 'LB' + Date.now().toString().slice(-8) + Math.random().toString(36).substr(2, 4).toUpperCase();
  }
  this.updatedAt = Date.now();
  next();
});

// Index for efficient queries
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ restaurant: 1, status: 1 });
orderSchema.index({ trackingCode: 1 });

module.exports = mongoose.model('Order', orderSchema);
