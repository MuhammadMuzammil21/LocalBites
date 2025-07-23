const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    cuisines: [String],
    address: {
      street: String,
      city: String,
      country: String,
    },
    phone: String,
    website: String,
    hours: Object, // e.g. { mon: ["11:00-23:00"], tue: ["closed"] }
    price_range: {
      type: String,
      enum: ['$', '$$', '$$$'],
      default: '$$',
    },
    images: {
      cover: String,
      gallery: [String],
    },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
    },
    owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    avg_rating: { type: Number, default: 0 },
    review_count: { type: Number, default: 0 },
    is_verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Geospatial index for map features
restaurantSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Restaurant', restaurantSchema);
