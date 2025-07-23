const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
  {
    restaurant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: String,
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      enum: ['Appetizer', 'Main Course', 'Dessert', 'Beverage', 'Other'],
      default: 'Other',
    },
    isVeg: {
      type: Boolean,
      default: true,
    },
    image: String, // URL to Cloudinary or local
    available: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MenuItem', menuItemSchema);
