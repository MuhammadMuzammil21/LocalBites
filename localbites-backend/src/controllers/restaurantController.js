const Restaurant = require('../models/Restaurant');
const slugify = require('slugify');

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

module.exports = {
  createRestaurant,
  getRestaurants,
  getRestaurant,
  updateRestaurant,
  deleteRestaurant,
};
