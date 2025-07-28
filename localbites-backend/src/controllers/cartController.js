const Cart = require('../models/Cart');

const addToCart = async (req, res) => {
  const { menuItemId, quantity } = req.body;
  const userId = req.user.id;

  try {
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const index = cart.items.findIndex((item) =>
      item.menuItem.equals(menuItemId)
    );

    if (index > -1) {
      cart.items[index].quantity += quantity;
    } else {
      cart.items.push({ menuItem: menuItemId, quantity });
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Error adding to cart', error: err.message });
  }
};

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.menuItem');
    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching cart' });
  }
};

const removeFromCart = async (req, res) => {
  const { menuItemId } = req.body;
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(
      (item) => !item.menuItem.equals(menuItemId)
    );

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Error removing item', error: err.message });
  }
};

module.exports = { addToCart, getCart, removeFromCart };
