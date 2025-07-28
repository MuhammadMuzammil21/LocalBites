const MenuItem = require('../models/MenuItem');

// @desc    Add a menu item
// @route   POST /api/menu/:restaurantId
// @access  Private (Owner/Admin)
const addMenuItem = async (req, res) => {
  const { name, description, price, category, isVeg, image } = req.body;
  const { restaurantId } = req.params;

  const newItem = new MenuItem({
    restaurant_id: restaurantId,
    name,
    description,
    price,
    category,
    isVeg,
    image,
  });

  const saved = await newItem.save();
  res.status(201).json(saved);
};

// @desc    Get all menu items for a restaurant
// @route   GET /api/menu/:restaurantId
// @access  Public
const getMenuItems = async (req, res) => {
  const { restaurantId } = req.params;
  const { search, category, isVeg, sort } = req.query;

  let query = { restaurant_id: restaurantId };

  if (search) {
    query.name = { $regex: search, $options: 'i' }; // case-insensitive partial match
  }

  if (category) {
    query.category = category;
  }

  if (isVeg === 'true' || isVeg === 'false') {
    query.isVeg = isVeg === 'true';
  }

  // Sorting logic
  let sortOption = {};
  if (sort === 'price') sortOption.price = 1;
  else if (sort === '-price') sortOption.price = -1;
  else if (sort === 'name') sortOption.name = 1;
  else if (sort === '-name') sortOption.name = -1;

  try {
    const items = await MenuItem.find(query).sort(sortOption);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};


// @desc    Get a single menu item
// @route   GET /api/menu/item/:id
// @access  Public
const getMenuItem = async (req, res) => {
  const item = await MenuItem.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Menu item not found' });
  res.json(item);
};

// @desc    Update a menu item
// @route   PUT /api/menu/item/:id
// @access  Private (Owner/Admin)
const updateMenuItem = async (req, res) => {
  const item = await MenuItem.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Menu item not found' });

  Object.assign(item, req.body);
  const updated = await item.save();
  res.json(updated);
};

// @desc    Delete a menu item
// @route   DELETE /api/menu/item/:id
// @access  Private (Owner/Admin)
const deleteMenuItem = async (req, res) => {
  const item = await MenuItem.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });

  await item.deleteOne();
  res.json({ message: 'Menu item deleted' });
};

module.exports = {
  addMenuItem,
  getMenuItems,
  getMenuItem,
  updateMenuItem,
  deleteMenuItem,
};
