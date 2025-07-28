const Cart = require('../models/Cart');
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ user: userId }).populate('items.menuItem');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const restaurantId = cart.items[0].menuItem.restaurant_id;
    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.menuItem.price * item.quantity,
      0
    );

    const newOrder = new Order({
      user: userId,
      restaurant: restaurantId,
      items: cart.items.map(({ menuItem, quantity }) => ({
        menuItem: menuItem._id,
        quantity,
      })),
      totalAmount,
    });

    await newOrder.save();
    await Cart.deleteOne({ user: userId });

    res.json(newOrder);
  } catch (err) {
    res.status(500).json({ message: 'Order failed', error: err.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('items.menuItem restaurant');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('restaurant', 'name')
      .populate('items.menuItem', 'name price');
    
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch all orders' });
  }
};

const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const validStatuses = ['Pending', 'Confirmed', 'Delivered'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status;
    await order.save();

    res.json({ message: 'Order updated', order });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update status' });
  }
};

module.exports = { placeOrder, getUserOrders, getAllOrders, updateOrderStatus };
