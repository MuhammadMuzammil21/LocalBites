const Restaurant = require('../models/Restaurant');
const slugify = require('slugify');
const mongoose = require('mongoose');

// @desc    Create a restaurant
// @route   POST /api/restaurants
// @access  Private (OWNER/ADMIN)
const createRestaurant = async (req, res) => {
  const { name, cuisines, address, phone, website } = req.body;

  const slug = slugify(name, { lower: true });

  const existing = await Restaurant.findOne({ slug });
  if (existing) return res.status(400).json({ message: 'Restaurant already exists' });

  const restaurant = await Restaurant.create({
    name,
    slug,
    cuisines,
    address,
    phone,
    website,
    owner_id: req.user._id,
  });

  res.status(201).json(restaurant);
};

// @desc    Get all restaurants
// @route   GET /api/restaurants
// @access  Public
const getRestaurants = async (req, res) => {
  const restaurants = await Restaurant.find();
  res.json(restaurants);
};

// @desc    Get single restaurant by ID or slug
// @route   GET /api/restaurants/:idOrSlug
// @access  Public
const getRestaurant = async (req, res) => {
  const query = mongoose.isValidObjectId(req.params.idOrSlug)
    ? { _id: req.params.idOrSlug }
    : { slug: req.params.idOrSlug };

  const restaurant = await Restaurant.findOne(query);
  if (!restaurant) return res.status(404).json({ message: 'Not found' });

  res.json(restaurant);
};

// @desc    Update restaurant
// @route   PUT /api/restaurants/:id
// @access  Private (OWNER/ADMIN)
const updateRestaurant = async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);

  if (!restaurant) return res.status(404).json({ message: 'Not found' });

  // Only owner or admin can edit
  if (
    restaurant.owner_id.toString() !== req.user._id.toString() &&
    req.user.role !== 'ADMIN'
  ) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  Object.assign(restaurant, req.body);

  if (req.body.name) {
    restaurant.slug = slugify(req.body.name, { lower: true });
  }

  const updated = await restaurant.save();
  res.json(updated);
};

// @desc    Delete restaurant
// @route   DELETE /api/restaurants/:id
// @access  Private (ADMIN only)
const deleteRestaurant = async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) return res.status(404).json({ message: 'Not found' });

  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Only admins can delete' });
  }

  await restaurant.deleteOne();
  res.json({ message: 'Restaurant deleted' });
};

// @desc    Search restaurants
// @route   GET /api/restaurants/search
// @access  Public
const searchRestaurants = async (req, res) => {
  try {
    const { q, location, cuisine } = req.query;
    const query = {};

    // Full-text or partial string search
    if (q) {
      const regex = new RegExp(q, 'i'); // case-insensitive
      query.$or = [
        { name: regex },
        { description: regex },
        { cuisines: regex }
      ];
    }

    // Cuisine filtering
    if (cuisine) {
      query.cuisines = { $regex: new RegExp(cuisine, 'i') };
    }

    // Location-based filtering (geo query)
    if (location) {
      const [lat, lng] = location.split(',').map(Number);
      if (!isNaN(lat) && !isNaN(lng)) {
        query.location = {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [lng, lat] // Note: [lng, lat]
            },
            $maxDistance: 10000 // 10km default radius
          }
        };
      }
    }

    const restaurants = await Restaurant.find(query).limit(50);
    res.json(restaurants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during restaurant search' });
  }
};

module.exports = {
  createRestaurant,
  getRestaurants,
  getRestaurant,
  updateRestaurant,
  deleteRestaurant,
  searchRestaurants,
};
