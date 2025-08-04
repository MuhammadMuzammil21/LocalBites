const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
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
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    images: [{
      type: String, // URLs to uploaded images
    }],
    helpful: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],
    ownerReply: {
      comment: {
        type: String,
        trim: true,
        maxlength: 1000,
      },
      repliedAt: {
        type: Date,
        default: Date.now,
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Ensure one review per user per restaurant
reviewSchema.index({ user: 1, restaurant: 1 }, { unique: true });

// Text index for search
reviewSchema.index({ title: 'text', comment: 'text' });

// Method to calculate helpful count
reviewSchema.virtual('helpfulCount').get(function() {
  return this.helpful.length;
});

// Ensure virtuals are serialized
reviewSchema.set('toJSON', { virtuals: true });
reviewSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Review', reviewSchema); 