const Restaurant = require('../models/Restaurant');
const slugify = require('slugify');
const mongoose = require('mongoose');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Create a restaurant
// @route   POST /api/restaurants
// @access  Private (OWNER/ADMIN)
const createRestaurant = asyncHandler(async (req, res) => {
  const { name, cuisines, address, phone, website, location } = req.body;

  // Validation
  if (!name) {
    return res.status(400).json({
      success: false,
      message: 'Restaurant name is required'
    });
  }

  if (!location || !location.coordinates || location.coordinates.length !== 2) {
    return res.status(400).json({
      success: false,
      message: 'Valid location coordinates are required'
    });
  }

  const slug = slugify(name, { lower: true });

  const existing = await Restaurant.findOne({ slug });
  if (existing) {
    return res.status(400).json({
      success: false,
      message: 'Restaurant with this name already exists'
    });
  }

  const restaurant = await Restaurant.create({
    name,
    slug,
    cuisines: cuisines || [],
    address: {
      ...address,
      city: 'Karachi',
      country: 'Pakistan'
    },
    phone,
    website,
    location,
    owner_id: req.user?._id,
  });

  res.status(201).json({
    success: true,
    data: restaurant
  });
});

// @desc    Get all restaurants
// @route   GET /api/restaurants
// @access  Public
const getRestaurants = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const restaurants = await Restaurant.find()
    .select('-__v')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Restaurant.countDocuments();

  res.json({
    success: true,
    data: restaurants,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

// @desc    Get single restaurant by ID or slug
// @route   GET /api/restaurants/:idOrSlug
// @access  Public
const getRestaurant = asyncHandler(async (req, res) => {
  const query = mongoose.isValidObjectId(req.params.idOrSlug)
    ? { _id: req.params.idOrSlug }
    : { slug: req.params.idOrSlug };

  const restaurant = await Restaurant.findOne(query).select('-__v');
  
  if (!restaurant) {
    return res.status(404).json({
      success: false,
      message: 'Restaurant not found'
    });
  }

  res.json({
    success: true,
    data: restaurant
  });
});

// @desc    Update restaurant
// @route   PUT /api/restaurants/:id
// @access  Private (OWNER/ADMIN)
const updateRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);

  if (!restaurant) {
    return res.status(404).json({
      success: false,
      message: 'Restaurant not found'
    });
  }

  // Only owner or admin can edit
  if (
    restaurant.owner_id?.toString() !== req.user?._id?.toString() &&
    req.user?.role !== 'ADMIN'
  ) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this restaurant'
    });
  }

  // Update fields
  Object.assign(restaurant, req.body);

  // Update slug if name changed
  if (req.body.name) {
    restaurant.slug = slugify(req.body.name, { lower: true });
  }

  // Ensure Karachi location
  if (req.body.address) {
    restaurant.address = {
      ...restaurant.address,
      ...req.body.address,
      city: 'Karachi',
      country: 'Pakistan'
    };
  }

  const updated = await restaurant.save();
  
  res.json({
    success: true,
    data: updated
  });
});

// @desc    Delete restaurant
// @route   DELETE /api/restaurants/:id
// @access  Private (ADMIN only)
const deleteRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);
  
  if (!restaurant) {
    return res.status(404).json({
      success: false,
      message: 'Restaurant not found'
    });
  }

  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Only admins can delete restaurants'
    });
  }

  await restaurant.deleteOne();
  
  res.json({
    success: true,
    message: 'Restaurant deleted successfully'
  });
});

// @desc    Search restaurants
// @route   GET /api/restaurants/search
// @access  Public
const searchRestaurants = asyncHandler(async (req, res) => {
  const { q, location, cuisine, radius = 10000 } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  let query = {};

  // Full-text or partial string search
  if (q) {
    const regex = new RegExp(q, 'i');
    query.$or = [
      { name: regex },
      { description: regex },
      { cuisines: regex }
    ];
  }

  // Cuisine filtering
  if (cuisine && cuisine !== 'All') {
    query.cuisines = { $regex: new RegExp(cuisine, 'i') };
  }

  // Location-based filtering (geo query) - Karachi focused
  if (location) {
    const coords = location.split(',').map(Number);
    if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
      const [lat, lng] = coords;
      query.location = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat] // [longitude, latitude]
          },
          $maxDistance: parseInt(radius)
        }
      };
    }
  }

  const restaurants = await Restaurant.find(query)
    .select('-__v')
    .sort({ avg_rating: -1, review_count: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Restaurant.countDocuments(query);

  res.json({
    success: true,
    data: restaurants,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

// @desc    Get nearby restaurants
// @route   GET /api/restaurants/nearby
// @access  Public
const getNearbyRestaurants = asyncHandler(async (req, res) => {
  const { lat, lng, radius = 5000 } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({
      success: false,
      message: 'Latitude and longitude are required'
    });
  }

  const restaurants = await Restaurant.find({
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [parseFloat(lng), parseFloat(lat)]
        },
        $maxDistance: parseInt(radius)
      }
    }
  }).limit(20);

  res.json({
    success: true,
    data: restaurants
  });
});

module.exports = {
  createRestaurant,
  getRestaurants,
  getRestaurant,
  updateRestaurant,
  deleteRestaurant,
  searchRestaurants,
  getNearbyRestaurants,
};
