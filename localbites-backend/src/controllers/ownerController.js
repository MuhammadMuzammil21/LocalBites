const asyncHandler = require('../utils/asyncHandler');
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');
const Review = require('../models/Review');
const Payment = require('../models/Payment');
const moment = require('moment');

// Get owner dashboard overview
const getDashboardOverview = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;

  // Verify ownership
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant || restaurant.owner_id.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this restaurant',
    });
  }

  // Get date range for analytics (last 30 days)
  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Get order statistics
  const orderStats = await Order.aggregate([
    {
      $match: {
        restaurant: restaurant._id,
        createdAt: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$totalAmount' },
        avgOrderValue: { $avg: '$totalAmount' },
      },
    },
  ]);

  // Get order status distribution
  const orderStatusDistribution = await Order.aggregate([
    {
      $match: {
        restaurant: restaurant._id,
        createdAt: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  // Get recent orders
  const recentOrders = await Order.find({ restaurant: restaurant._id })
    .populate('user', 'name')
    .sort({ createdAt: -1 })
    .limit(5);

  // Get recent reviews
  const recentReviews = await Review.find({ restaurant: restaurant._id })
    .populate('user', 'name')
    .sort({ createdAt: -1 })
    .limit(5);

  // Get menu item statistics
  const menuItemStats = await MenuItem.aggregate([
    {
      $match: { restaurant_id: restaurant._id },
    },
    {
      $group: {
        _id: null,
        totalItems: { $sum: 1 },
        availableItems: {
          $sum: { $cond: ['$available', 1, 0] },
        },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    overview: {
      restaurant: {
        name: restaurant.name,
        avgRating: restaurant.avg_rating,
        reviewCount: restaurant.review_count,
      },
      orders: orderStats[0] || {
        totalOrders: 0,
        totalRevenue: 0,
        avgOrderValue: 0,
      },
      orderStatusDistribution,
      menuItems: menuItemStats[0] || {
        totalItems: 0,
        availableItems: 0,
      },
      recentOrders,
      recentReviews,
    },
  });
});

// Get restaurant orders with filtering
const getRestaurantOrders = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;
  const { page = 1, limit = 20, status, startDate, endDate } = req.query;
  const skip = (page - 1) * limit;

  // Verify ownership
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant || restaurant.owner_id.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this restaurant',
    });
  }

  const filter = { restaurant: restaurantId };
  if (status) filter.status = status;
  if (startDate && endDate) {
    filter.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  const orders = await Order.find(filter)
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Order.countDocuments(filter);

  res.status(200).json({
    success: true,
    orders,
    pagination: {
      current: parseInt(page),
      total: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  });
});

// Update order status
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { status, estimatedDeliveryTime } = req.body;

  const order = await Order.findById(orderId).populate('restaurant', 'owner_id');

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found',
    });
  }

  if (order.restaurant.owner_id.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this order',
    });
  }

  order.status = status;
  if (estimatedDeliveryTime) {
    order.estimatedDeliveryTime = new Date(estimatedDeliveryTime);
  }

  await order.save();

  // Create notification for customer
  const Notification = require('../models/Notification');
  await Notification.create({
    recipient: order.user,
    type: `ORDER_${status.toUpperCase().replace(' ', '_')}`,
    title: `Order ${status}`,
    message: `Your order #${order.trackingCode} is now ${status.toLowerCase()}`,
    data: {
      orderId: order._id,
      trackingCode: order.trackingCode,
    },
  });

  res.status(200).json({
    success: true,
    message: 'Order status updated successfully',
    order,
  });
});

// Get restaurant menu items
const getRestaurantMenuItems = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;
  const { page = 1, limit = 50, category, available } = req.query;
  const skip = (page - 1) * limit;

  // Verify ownership
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant || restaurant.owner_id.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this restaurant',
    });
  }

  const filter = { restaurant_id: restaurantId };
  if (category) filter.category = category;
  if (available !== undefined) filter.available = available === 'true';

  const menuItems = await MenuItem.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await MenuItem.countDocuments(filter);

  res.status(200).json({
    success: true,
    menuItems,
    pagination: {
      current: parseInt(page),
      total: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  });
});

// Create menu item
const createMenuItem = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;
  const { name, description, price, category, isVeg, image } = req.body;

  // Verify ownership
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant || restaurant.owner_id.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this restaurant',
    });
  }

  const menuItem = await MenuItem.create({
    restaurant_id: restaurantId,
    name,
    description,
    price,
    category,
    isVeg,
    image,
  });

  res.status(201).json({
    success: true,
    message: 'Menu item created successfully',
    menuItem,
  });
});

// Update menu item
const updateMenuItem = asyncHandler(async (req, res) => {
  const { menuItemId } = req.params;
  const updateData = req.body;

  const menuItem = await MenuItem.findById(menuItemId).populate('restaurant_id', 'owner_id');

  if (!menuItem) {
    return res.status(404).json({
      success: false,
      message: 'Menu item not found',
    });
  }

  if (menuItem.restaurant_id.owner_id.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this menu item',
    });
  }

  const updatedMenuItem = await MenuItem.findByIdAndUpdate(
    menuItemId,
    updateData,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: 'Menu item updated successfully',
    menuItem: updatedMenuItem,
  });
});

// Delete menu item
const deleteMenuItem = asyncHandler(async (req, res) => {
  const { menuItemId } = req.params;

  const menuItem = await MenuItem.findById(menuItemId).populate('restaurant_id', 'owner_id');

  if (!menuItem) {
    return res.status(404).json({
      success: false,
      message: 'Menu item not found',
    });
  }

  if (menuItem.restaurant_id.owner_id.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this menu item',
    });
  }

  await MenuItem.findByIdAndDelete(menuItemId);

  res.status(200).json({
    success: true,
    message: 'Menu item deleted successfully',
  });
});

// Get restaurant analytics
const getRestaurantAnalytics = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;
  const { period = '30' } = req.query; // days

  // Verify ownership
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant || restaurant.owner_id.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this restaurant',
    });
  }

  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - parseInt(period) * 24 * 60 * 60 * 1000);

  // Daily revenue data
  const dailyRevenue = await Order.aggregate([
    {
      $match: {
        restaurant: restaurant._id,
        createdAt: { $gte: startDate, $lte: endDate },
        paymentStatus: 'Paid',
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
        },
        revenue: { $sum: '$totalAmount' },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Top selling items
  const topItems = await Order.aggregate([
    {
      $match: {
        restaurant: restaurant._id,
        createdAt: { $gte: startDate, $lte: endDate },
      },
    },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.menuItem',
        totalQuantity: { $sum: '$items.quantity' },
        totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
      },
    },
    {
      $lookup: {
        from: 'menuitems',
        localField: '_id',
        foreignField: '_id',
        as: 'menuItem',
      },
    },
    { $unwind: '$menuItem' },
    {
      $project: {
        name: '$menuItem.name',
        totalQuantity: 1,
        totalRevenue: 1,
      },
    },
    { $sort: { totalQuantity: -1 } },
    { $limit: 10 },
  ]);

  // Customer statistics
  const customerStats = await Order.aggregate([
    {
      $match: {
        restaurant: restaurant._id,
        createdAt: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: '$user',
        totalOrders: { $sum: 1 },
        totalSpent: { $sum: '$totalAmount' },
      },
    },
    {
      $group: {
        _id: null,
        uniqueCustomers: { $sum: 1 },
        avgOrdersPerCustomer: { $avg: '$totalOrders' },
        avgSpentPerCustomer: { $avg: '$totalSpent' },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    analytics: {
      period: `${period} days`,
      dailyRevenue,
      topItems,
      customerStats: customerStats[0] || {
        uniqueCustomers: 0,
        avgOrdersPerCustomer: 0,
        avgSpentPerCustomer: 0,
      },
    },
  });
});

module.exports = {
  getDashboardOverview,
  getRestaurantOrders,
  updateOrderStatus,
  getRestaurantMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getRestaurantAnalytics,
}; 