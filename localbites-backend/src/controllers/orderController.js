const asyncHandler = require('../utils/asyncHandler');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const Notification = require('../models/Notification');

// Place order with enhanced features
const placeOrder = asyncHandler(async (req, res) => {
  const {
    deliveryAddress,
    paymentMethod,
    specialInstructions,
    estimatedDeliveryTime,
  } = req.body;

  const userId = req.user.id;
  const cart = await Cart.findOne({ user: userId }).populate('items.menuItem');

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Cart is empty',
    });
  }

  // Validate all items are from the same restaurant
  const restaurantId = cart.items[0].menuItem.restaurant_id;
  const allFromSameRestaurant = cart.items.every(
    (item) => item.menuItem.restaurant_id.toString() === restaurantId.toString()
  );

  if (!allFromSameRestaurant) {
    return res.status(400).json({
      success: false,
      message: 'All items must be from the same restaurant',
    });
  }

  // Calculate totals
  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0
  );

  // Calculate delivery fee (basic implementation)
  const deliveryFee = subtotal > 1000 ? 0 : 200; // Free delivery over 1000 PKR
  const tax = subtotal * 0.15; // 15% tax
  const totalAmount = subtotal + deliveryFee + tax;

  // Create order with enhanced fields
  const orderData = {
    user: userId,
    restaurant: restaurantId,
    items: cart.items.map(({ menuItem, quantity, specialInstructions: itemInstructions }) => ({
      menuItem: menuItem._id,
      quantity,
      price: menuItem.price,
      specialInstructions: itemInstructions,
    })),
    subtotal,
    deliveryFee,
    tax,
    totalAmount,
    paymentMethod: paymentMethod || 'Cash',
    deliveryAddress,
    specialInstructions,
    estimatedDeliveryTime: estimatedDeliveryTime ? new Date(estimatedDeliveryTime) : null,
  };

  const newOrder = await Order.create(orderData);

  // Clear cart
  await Cart.deleteOne({ user: userId });

  // Create notification for restaurant owner
  const restaurant = await require('../models/Restaurant').findById(restaurantId).populate('owner_id');
  if (restaurant.owner_id) {
    await Notification.create({
      recipient: restaurant.owner_id._id,
      type: 'ORDER_CONFIRMED',
      title: 'New Order Received',
      message: `New order #${newOrder.trackingCode} received for PKR ${totalAmount}`,
      data: {
        orderId: newOrder._id,
        amount: totalAmount,
        trackingCode: newOrder.trackingCode,
      },
    });
  }

  // Populate order details for response
  const populatedOrder = await Order.findById(newOrder._id)
    .populate('items.menuItem', 'name price image')
    .populate('restaurant', 'name address');

  res.status(201).json({
    success: true,
    message: 'Order placed successfully',
    order: populatedOrder,
  });
});

// Get user orders with enhanced filtering
const getUserOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, restaurantId } = req.query;
  const skip = (page - 1) * limit;

  const filter = { user: req.user.id };
  if (status) filter.status = status;
  if (restaurantId) filter.restaurant = restaurantId;

  const orders = await Order.find(filter)
    .populate('items.menuItem', 'name price image')
    .populate('restaurant', 'name address')
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

// Get order by tracking code
const getOrderByTrackingCode = asyncHandler(async (req, res) => {
  const { trackingCode } = req.params;

  const order = await Order.findOne({ trackingCode })
    .populate('items.menuItem', 'name price image')
    .populate('restaurant', 'name address phone')
    .populate('user', 'name email');

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found',
    });
  }

  // Check if user is authorized to view this order
  if (order.user._id.toString() !== req.user.id && req.user.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to view this order',
    });
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// Cancel order
const cancelOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { reason } = req.body;

  const order = await Order.findById(orderId);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found',
    });
  }

  if (order.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to cancel this order',
    });
  }

  // Check if order can be cancelled
  const cancellableStatuses = ['Pending', 'Confirmed'];
  if (!cancellableStatuses.includes(order.status)) {
    return res.status(400).json({
      success: false,
      message: 'Order cannot be cancelled at this stage',
    });
  }

  order.status = 'Cancelled';
  order.specialInstructions = reason ? `Cancelled: ${reason}` : 'Cancelled by customer';
  await order.save();

  // Notify restaurant owner
  const restaurant = await require('../models/Restaurant').findById(order.restaurant).populate('owner_id');
  if (restaurant.owner_id) {
    await Notification.create({
      recipient: restaurant.owner_id._id,
      type: 'ORDER_CANCELLED',
      title: 'Order Cancelled',
      message: `Order #${order.trackingCode} has been cancelled`,
      data: {
        orderId: order._id,
        trackingCode: order.trackingCode,
      },
    });
  }

  res.status(200).json({
    success: true,
    message: 'Order cancelled successfully',
    order,
  });
});

// Reorder functionality
const reorder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const originalOrder = await Order.findById(orderId)
    .populate('items.menuItem')
    .populate('restaurant');

  if (!originalOrder) {
    return res.status(404).json({
      success: false,
      message: 'Original order not found',
    });
  }

  if (originalOrder.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to reorder this order',
    });
  }

  // Check if items are still available
  const unavailableItems = [];
  for (const item of originalOrder.items) {
    const menuItem = await MenuItem.findById(item.menuItem._id);
    if (!menuItem || !menuItem.available) {
      unavailableItems.push(item.menuItem.name);
    }
  }

  if (unavailableItems.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Some items are no longer available',
      unavailableItems,
    });
  }

  // Create new order based on original
  const newOrderData = {
    user: req.user.id,
    restaurant: originalOrder.restaurant._id,
    items: originalOrder.items.map(({ menuItem, quantity, specialInstructions }) => ({
      menuItem: menuItem._id,
      quantity,
      price: menuItem.price,
      specialInstructions,
    })),
    subtotal: originalOrder.subtotal,
    deliveryFee: originalOrder.deliveryFee,
    tax: originalOrder.tax,
    totalAmount: originalOrder.totalAmount,
    paymentMethod: originalOrder.paymentMethod,
    deliveryAddress: originalOrder.deliveryAddress,
    specialInstructions: originalOrder.specialInstructions,
    isReordered: true,
    originalOrder: originalOrder._id,
  };

  const newOrder = await Order.create(newOrderData);

  const populatedOrder = await Order.findById(newOrder._id)
    .populate('items.menuItem', 'name price image')
    .populate('restaurant', 'name address');

  res.status(201).json({
    success: true,
    message: 'Order recreated successfully',
    order: populatedOrder,
  });
});

// Get all orders (admin only)
const getAllOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, restaurantId, startDate, endDate } = req.query;
  const skip = (page - 1) * limit;

  const filter = {};
  if (status) filter.status = status;
  if (restaurantId) filter.restaurant = restaurantId;
  if (startDate && endDate) {
    filter.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  const orders = await Order.find(filter)
    .populate('user', 'name email')
    .populate('restaurant', 'name')
    .populate('items.menuItem', 'name price')
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

// Update order status (admin/owner only)
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { status, estimatedDeliveryTime } = req.body;

  const validStatuses = ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered', 'Cancelled'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status',
    });
  }

  const order = await Order.findById(orderId).populate('restaurant', 'owner_id');
  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found',
    });
  }

  // Check authorization (admin or restaurant owner)
  if (req.user.role !== 'ADMIN' && order.restaurant.owner_id.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this order',
    });
  }

  order.status = status;
  if (estimatedDeliveryTime) {
    order.estimatedDeliveryTime = new Date(estimatedDeliveryTime);
  }

  // Set actual delivery time if status is delivered
  if (status === 'Delivered') {
    order.actualDeliveryTime = new Date();
  }

  await order.save();

  // Create notification for customer
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

module.exports = {
  placeOrder,
  getUserOrders,
  getOrderByTrackingCode,
  cancelOrder,
  reorder,
  getAllOrders,
  updateOrderStatus,
};
